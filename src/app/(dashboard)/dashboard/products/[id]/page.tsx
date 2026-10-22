
import Link from "next/link";
import {
    ArrowRight,
    CalendarDays,
    Image as ImageIcon,
    Package,
    Pencil,
    Tag,
} from "lucide-react";

import {
    getAdminProduct,
    type AdminProduct,
} from "@/api/admin/products";

type Props = {
    params: Promise<{ id: string }>;
};

function extractProduct(
    response: AdminProduct | { data: AdminProduct },
): AdminProduct {
    if ("data" in response && response.data) {
        return response.data;
    }

    return response as AdminProduct;
}

function formatPrice(price: number) {
    return `${Number(price).toLocaleString("fa-IR")} تومان`;
}

export default async function ProductDetailsPage({ params }: Props) {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId < 1) {
        return (
            <main dir="rtl" className="space-y-4">
                <h1 className="text-xl font-bold">
                    شناسه محصول نامعتبر است.
                </h1>
                <Link
                    href="/dashboard/products"
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                >
                    <ArrowRight className="size-4" />
                    بازگشت به محصولات
                </Link>
            </main>
        );
    }

    let product: AdminProduct;

    try {
        const response = await getAdminProduct(productId);
        product = extractProduct(response);
    } catch {
        return (
            <main dir="rtl" className="space-y-4">
                <h1 className="text-xl font-bold">
                    دریافت اطلاعات محصول ناموفق بود.
                </h1>
                <p className="text-sm text-muted-foreground">
                    ممکن است محصول وجود نداشته باشد یا ارتباط با سرور برقرار نشده باشد.
                </p>
                <Link
                    href="/dashboard/products"
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                >
                    <ArrowRight className="size-4" />
                    بازگشت به محصولات
                </Link>
            </main>
        );
    }

    const image =
        product.images?.find((item) => Boolean(item.is_primary))
            ?.image_url ?? product.images?.[0]?.image_url;

    return (
        <main dir="rtl" className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <Link
                        href="/dashboard/products"
                        className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowRight className="size-4" />
                        بازگشت به محصولات
                    </Link>

                    <h1 className="text-2xl font-bold">
                        جزئیات محصول
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        مشاهده اطلاعات ثبت‌شده محصول
                    </p>
                </div>

                <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                    <Pencil className="size-4" />
                    ویرایش محصول
                </Link>
            </div>

            <section className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="flex aspect-square items-center justify-center bg-muted/30 p-4">
                        {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={image}
                                alt={product.title}
                                className="h-full w-full rounded-lg object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                <ImageIcon className="size-16" />
                                <span className="text-sm">
                                    تصویری برای این محصول ثبت نشده است.
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            شناسه محصول:{" "}
                            {product.id.toLocaleString("fa-IR")}
                        </p>
                        <h2 className="mt-3 text-xl font-bold leading-8">
                            {product.title}
                        </h2>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-sm text-muted-foreground">
                            قیمت محصول
                        </p>
                        <p className="mt-2 text-2xl font-bold">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Tag className="size-4" />
                                دسته‌بندی
                            </div>
                            <p className="mt-3 font-medium">
                                {product.category?.name ?? "بدون دسته‌بندی"}
                            </p>
                        </div>

                        <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Package className="size-4" />
                                شناسه
                            </div>
                            <p className="mt-3 font-medium">
                                {product.id.toLocaleString("fa-IR")}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 border-t pt-5">
                        <h3 className="font-semibold">توضیحات محصول</h3>
                        <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                            {product.description?.trim() ||
                                "توضیحاتی برای این محصول ثبت نشده یا API آن را برنگردانده است."}
                        </p>
                    </div>

                    {product.created_at && (
                        <div className="flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
                            <CalendarDays className="size-4 shrink-0" />
                            <span>
                                تاریخ ثبت:{" "}
                                {product.created_at}
                            </span>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}