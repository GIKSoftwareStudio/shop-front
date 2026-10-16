
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";

import {
    getAdminProduct,
    updateAdminProduct,
    type AdminProduct,
} from "@/api/admin/products";
import {
    getAdminCategories,
    type Category,
} from "@/api/admin/categories";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const productSchema = z.object({
    name: z.string().trim().min(2, "نام محصول باید حداقل ۲ کاراکتر باشد."),
    category_id: z.number().int().positive("یک دسته‌بندی انتخاب کنید."),
    description: z.string().trim().min(5, "توضیحات باید حداقل ۵ کاراکتر باشد."),
    price: z.number().positive("قیمت باید بیشتر از صفر باشد."),
});

type ProductFormValues = z.infer<typeof productSchema>;

type Props = {
    id: number;
};

type CategoriesResponse =
    | Category[]
    | { categories?: Category[]; data?: Category[] };

function extractCategories(response: CategoriesResponse): Category[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.categories)) return response.categories;
    if (Array.isArray(response.data)) return response.data;
    return [];
}

function extractProduct(
    response: AdminProduct | { data: AdminProduct },
): AdminProduct {
    if ("data" in response && response.data) {
        return response.data;
    }

    return response as AdminProduct;
}

export default function EditProductForm({ id }: Props) {
    const router = useRouter();

    const [product, setProduct] = useState<AdminProduct | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            category_id: 0,
            description: "",
            price: 0,
        },
    });

    useEffect(() => {
        let active = true;

        async function loadData() {
            setLoading(true);
            setLoadError("");

            try {
                const [productResponse, categoryResponse] =
                    await Promise.all([
                        getAdminProduct(id),
                        getAdminCategories(),
                    ]);

                const item = extractProduct(productResponse);
                const categoryItems = extractCategories(categoryResponse);

                if (!active) return;

                setProduct(item);
                setCategories(categoryItems);

                reset({
                    name: item.title ?? "",
                    category_id: item.category?.id ?? 0,
                    description: item.description ?? "",
                    price: Number(item.price),
                });

                if (categoryItems.length === 0) {
                    setLoadError(
                        "دسته‌بندی‌ای دریافت نشد. پاسخ API دسته‌بندی‌ها را بررسی کنید.",
                    );
                }
            } catch (error) {
                console.error("Load product for edit error:", error);

                if (active) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : "دریافت اطلاعات محصول ناموفق بود.",
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void loadData();

        return () => {
            active = false;
        };
    }, [id, reset]);

    async function onSubmit(values: ProductFormValues) {
        try {
            await updateAdminProduct(id, {
                name: values.name.trim(),
                category_id: values.category_id,
                description: values.description.trim(),
                price: values.price,
            });

            toast.success("تغییرات محصول با موفقیت ذخیره شد.");

            router.push("/dashboard/products");
            router.refresh();
        } catch (error) {
            console.error("Update product API error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "ویرایش محصول ناموفق بود. دوباره تلاش کنید.",
            );
        }
    }

    const fieldClass =
        "mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

    if (loading) {
        return (
            <section
                dir="rtl"
                className="mx-auto w-full max-w-4xl space-y-6"
                aria-busy="true"
                aria-label="در حال دریافت اطلاعات محصول"
            >
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="h-4 w-64 animate-pulse rounded bg-muted" />

                <div className="space-y-5 rounded-xl border p-5 sm:p-7">
                    <div className="grid gap-5 sm:grid-cols-2">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                <div className="h-10 animate-pulse rounded-lg bg-muted" />
                            </div>
                        ))}
                    </div>

                    <div className="h-28 animate-pulse rounded-lg bg-muted" />
                    <div className="flex justify-end">
                        <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
                    </div>
                </div>
            </section>
        );
    }

    if (loadError || !product) {
        return (
            <section dir="rtl" className="space-y-4">
                <h1 className="text-2xl font-bold">ویرایش محصول</h1>

                <div
                    role="alert"
                    className="rounded-xl border border-destructive/30 bg-destructive/5 p-5"
                >
                    <p className="text-sm text-destructive">
                        {loadError || "محصول موردنظر پیدا نشد."}
                    </p>

                    <Button
                        className="mt-4"
                        variant="outline"
                        nativeButton={false}
                        render={<Link href="/dashboard/products" />}
                    >
                        بازگشت به محصولات
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section
            dir="rtl"
            className="mx-auto w-full max-w-4xl space-y-6"
        >
            <div className="flex items-center gap-3">
                <Button
                    nativeButton={false}
                    variant="outline"
                    size="icon"
                    render={<Link href="/dashboard/products" />}
                    aria-label="بازگشت به محصولات"
                    disabled={isSubmitting}
                >
                    <ArrowRight className="size-4" />
                </Button>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        ویرایش محصول
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        ویرایش اطلاعات «{product.title}»
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 rounded-xl border bg-card p-5 sm:p-7"
            >
                <fieldset
                    disabled={isSubmitting}
                    className="grid gap-5 sm:grid-cols-2"
                >
                    <div>
                        <label
                            htmlFor="name"
                            className="text-sm font-medium"
                        >
                            نام محصول *
                        </label>

                        <Input
                            id="name"
                            {...register("name")}
                            aria-invalid={Boolean(errors.name)}
                            className="mt-2"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="category_id"
                            className="text-sm font-medium"
                        >
                            دسته‌بندی *
                        </label>

                        <select
                            id="category_id"
                            {...register("category_id", {
                                valueAsNumber: true,
                            })}
                            aria-invalid={Boolean(errors.category_id)}
                            className={fieldClass}
                        >
                            <option value={0}>انتخاب دسته‌بندی</option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {errors.category_id && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.category_id.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="price"
                            className="text-sm font-medium"
                        >
                            قیمت (تومان) *
                        </label>

                        <Input
                            id="price"
                            type="number"
                            min="0.01"
                            step="any"
                            {...register("price", {
                                valueAsNumber: true,
                            })}
                            aria-invalid={Boolean(errors.price)}
                            className="mt-2"
                        />

                        {errors.price && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.price.message}
                            </p>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium"
                        >
                            توضیحات محصول *
                        </label>

                        <textarea
                            id="description"
                            {...register("description")}
                            rows={5}
                            className={fieldClass}
                            aria-invalid={Boolean(errors.description)}
                        />

                        {errors.description && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                </fieldset>

                <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                    <Button
                        variant="outline"
                        nativeButton={false}
                        render={<Link href="/dashboard/products" />}
                        disabled={isSubmitting}
                    >
                        انصراف
                    </Button>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <LoaderCircle className="ml-2 size-4 animate-spin" />
                        ) : (
                            <Save className="ml-2 size-4" />
                        )}

                        {isSubmitting
                            ? "در حال ذخیره..."
                            : "ذخیره تغییرات"}
                    </Button>
                </div>
            </form>
        </section>
    );
}