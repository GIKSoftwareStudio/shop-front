
import { Suspense } from "react";
import Link from "next/link";
import { Package, PackagePlus } from "lucide-react";

import { getAdminProducts } from "@/api/admin/products";
import ProductsTable from "@/components/dashboard/products/ProductsTable";

type Props = {
    searchParams: Promise<{
        page?: string;
    }>;
};

function ProductsLoading() {
    return (
        <section dir="rtl" className="space-y-6">
            <div className="space-y-2">
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="h-4 w-64 animate-pulse rounded bg-muted" />
            </div>

            <div className="overflow-hidden rounded-xl border">
                <div className="h-12 animate-pulse bg-muted" />

                {Array.from({ length: 6 }, (_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 border-t p-4"
                    >
                        <div className="size-12 animate-pulse rounded-lg bg-muted" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                            <div className="h-3 w-1/5 animate-pulse rounded bg-muted" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

async function ProductsContent({ searchParams }: Props) {
    const params = await searchParams;
    const parsedPage = Number(params.page);

    const currentPage =
        Number.isInteger(parsedPage) && parsedPage > 0
            ? parsedPage
            : 1;

    let response;

    try {
        response = await getAdminProducts(currentPage);
    } catch (error) {
        console.error("Admin products API error:", error);

        return (
            <section dir="rtl" className="space-y-4">
                <h1 className="text-2xl font-bold">مدیریت محصولات</h1>

                <div
                    role="alert"
                    className="rounded-xl border border-destructive/30 bg-destructive/5 p-5"
                >
                    <p className="font-semibold text-destructive">
                        دریافت محصولات ناموفق بود.
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                        اتصال بک‌اند و آدرس API را بررسی کنید؛ سپس صفحه را دوباره بارگذاری کنید.
                    </p>

                    <Link
                        href={`/dashboard/products?page=${currentPage}`}
                        className="mt-4 inline-flex rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                    >
                        تلاش مجدد
                    </Link>
                </div>
            </section>
        );
    }

    const products = response.data ?? [];
    const totalPages = response.meta?.last_page ?? 1;
    const totalProducts = response.meta?.total ?? products.length;

    return (
        <section dir="rtl" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        مدیریت محصولات
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        مشاهده و مدیریت محصولات فروشگاه
                    </p>
                </div>

                <Link
                    href="/dashboard/products/create"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                    <PackagePlus className="size-4" />
                    افزودن محصول
                </Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Package className="size-5" />
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            تعداد کل محصولات
                        </p>

                        <p className="text-lg font-bold">
                            {totalProducts.toLocaleString("fa-IR")}
                        </p>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">
                    صفحه {currentPage.toLocaleString("fa-IR")} از{" "}
                    {totalPages.toLocaleString("fa-IR")}
                </p>
            </div>

            <ProductsTable
                products={products}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </section>
    );
}

export default function AdminProductsPage({ searchParams }: Props) {
    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsContent searchParams={searchParams} />
        </Suspense>
    );
}
