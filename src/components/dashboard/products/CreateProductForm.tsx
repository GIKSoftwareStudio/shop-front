
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
    createAdminProduct,
    type CreateProductInput,
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
    stock: z.number().int().min(0, "موجودی نمی‌تواند منفی باشد."),
});

type ProductFormValues = z.infer<typeof productSchema>;

type CategoriesResponse =
    | Category[]
    | { categories?: Category[]; data?: Category[] };

function extractCategories(response: CategoriesResponse): Category[] {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response.categories)) {
        return response.categories;
    }

    if (Array.isArray(response.data)) {
        return response.data;
    }

    return [];
}

export default function CreateProductForm() {
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState("");

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
            stock: 0,
        },
    });

    useEffect(() => {
        let active = true;

        async function loadCategories() {
            setCategoriesLoading(true);
            setCategoriesError("");

            try {
                const response = await getAdminCategories();
                const items = extractCategories(response);

                if (!active) return;

                setCategories(items);

                if (items.length === 0) {
                    setCategoriesError(
                        "دسته‌بندی‌ای دریافت نشد. ساختار پاسخ API را بررسی کنید.",
                    );
                }
            } catch (error) {
                console.error("Categories API error:", error);

                if (!active) return;

                setCategories([]);
                setCategoriesError(
                    "دریافت دسته‌بندی‌ها ناموفق بود. اتصال بک‌اند و پاسخ API را بررسی کنید.",
                );
            } finally {
                if (active) {
                    setCategoriesLoading(false);
                }
            }
        }

        void loadCategories();

        return () => {
            active = false;
        };
    }, []);

    async function onSubmit(values: ProductFormValues) {
        try {
            const payload: CreateProductInput = {
                name: values.name.trim(),
                category_id: values.category_id,
                description: values.description.trim(),
                price: values.price,
                stock: values.stock,
            };

            await createAdminProduct(payload);

            toast.success("محصول با موفقیت ثبت شد.");

            router.push("/dashboard/products");
            router.refresh();
        } catch (error) {
            console.error("Create product API error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "ثبت محصول ناموفق بود. دوباره تلاش کنید.",
            );
        }
    }

    const fieldClass =
        "mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

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
                >
                    <ArrowRight className="size-4" />
                </Button>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        افزودن محصول
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        اطلاعات محصول جدید را وارد کنید.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 rounded-xl border bg-card p-5 sm:p-7"
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="name"
                            className="text-sm font-medium"
                        >
                            نام محصول{" "}
                            <span className="text-destructive">*</span>
                        </label>

                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="مثلاً ساعت مچی"
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
                            دسته‌بندی{" "}
                            <span className="text-destructive">*</span>
                        </label>

                        <select
                            id="category_id"
                            {...register("category_id", {
                                valueAsNumber: true,
                            })}
                            disabled={
                                categoriesLoading ||
                                categories.length === 0 ||
                                isSubmitting
                            }
                            aria-invalid={Boolean(errors.category_id)}
                            className={fieldClass}
                        >
                            <option value={0}>
                                {categoriesLoading
                                    ? "در حال دریافت دسته‌بندی‌ها..."
                                    : categories.length === 0
                                      ? "دسته‌بندی‌ای موجود نیست"
                                      : "انتخاب دسته‌بندی"}
                            </option>

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

                        {categoriesError && (
                            <p
                                role="alert"
                                className="mt-1 text-sm text-destructive"
                            >
                                {categoriesError}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="price"
                            className="text-sm font-medium"
                        >
                            قیمت (تومان){" "}
                            <span className="text-destructive">*</span>
                        </label>

                        <Input
                            id="price"
                            type="number"
                            min="0.01"
                            step="any"
                            {...register("price", {
                                valueAsNumber: true,
                            })}
                            placeholder="مثلاً ۲۵۰۰۰۰"
                            aria-invalid={Boolean(errors.price)}
                            className="mt-2"
                        />

                        {errors.price && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.price.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="stock"
                            className="text-sm font-medium"
                        >
                            موجودی انبار{" "}
                            <span className="text-destructive">*</span>
                        </label>

                        <Input
                            id="stock"
                            type="number"
                            min="0"
                            step="1"
                            {...register("stock", {
                                valueAsNumber: true,
                            })}
                            placeholder="مثلاً ۱۰"
                            aria-invalid={Boolean(errors.stock)}
                            className="mt-2"
                        />

                        {errors.stock && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.stock.message}
                            </p>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium"
                        >
                            توضیحات محصول{" "}
                            <span className="text-destructive">*</span>
                        </label>

                        <textarea
                            id="description"
                            {...register("description")}
                            rows={5}
                            placeholder="توضیحات محصول را وارد کنید..."
                            aria-invalid={Boolean(errors.description)}
                            className={fieldClass}
                        />

                        {errors.description && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
                    <Button
                        nativeButton={false}
                        variant="outline"
                        render={<Link href="/dashboard/products" />}
                        disabled={isSubmitting}
                    >
                        انصراف
                    </Button>

                    <Button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            categoriesLoading ||
                            categories.length === 0
                        }
                    >
                        {isSubmitting ? (
                            <LoaderCircle className="ml-2 size-4 animate-spin" />
                        ) : (
                            <Save className="ml-2 size-4" />
                        )}

                        {isSubmitting
                            ? "در حال ثبت..."
                            : "ثبت محصول"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
