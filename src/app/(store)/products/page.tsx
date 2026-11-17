
import { Suspense } from "react";

import {
    getProducts,
    getStoreCategories,
    type ProductFilters,
    type StoreCategory,
} from "@/api/store/products";

import ProductCard from "@/components/ProductCard";
import ProductsFilters from "@/components/store/ProductsFilters";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
    searchParams: Promise<{
        search?: string;
        category_id?: string;
        min_price?: string;
        max_price?: string;
        in_stock?: string;
        sort_by?: string;
        per_page?: string;
        page?: string;
    }>;
};

function parsePositiveInteger(value?: string): number | undefined {
    if (!value) return undefined;

    const parsed = Number(value);

    return Number.isInteger(parsed) && parsed > 0
        ? parsed
        : undefined;
}

function parsePrice(value?: string): number | undefined {
    if (!value) return undefined;

    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= 0
        ? parsed
        : undefined;
}

function ProductsLoading() {
    return (
        <main dir="rtl" className="mx-auto w-full max-w-7xl p-6">
            <div className="mb-8 h-8 w-48 animate-pulse rounded bg-muted" />

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
                <div className="h-64 animate-pulse rounded-xl bg-muted" />

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }, (_, index) => (
                        <div
                            key={index}
                            className="animate-pulse space-y-3 rounded-xl border p-3"
                        >
                            <div className="aspect-square rounded-lg bg-muted" />
                            <div className="h-4 w-3/4 rounded bg-muted" />
                            <div className="h-4 w-1/2 rounded bg-muted" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

async function ProductsContent({ searchParams }: Props) {
    const params = await searchParams;

    const requestedPage = parsePositiveInteger(params.page);
    const requestedPerPage = parsePositiveInteger(params.per_page);

    const filters: ProductFilters = {
        search: params.search?.trim() || undefined,
        category_id: parsePositiveInteger(params.category_id),
        min_price: parsePrice(params.min_price),
        max_price: parsePrice(params.max_price),
        in_stock:
            params.in_stock === "true"
                ? true
                : params.in_stock === "false"
                    ? false
                    : undefined,
        sort_by:
            params.sort_by === "newest" || params.sort_by === "oldest"
                ? params.sort_by
                : undefined,
        per_page: requestedPerPage,
        page: requestedPage,
    };

    if (
        filters.min_price !== undefined &&
        filters.max_price !== undefined &&
        filters.min_price > filters.max_price
    ) {
        filters.min_price = undefined;
        filters.max_price = undefined;
    }

    const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(filters),
        getStoreCategories(),
    ]);

    const data = productsResponse;
    const categories = categoriesResponse;

    const totalPages = data.meta.last_page;
    const currentPage = data.meta.current_page;

    function getPageHref(page: number) {
        const query = new URLSearchParams();

        if (filters.search) {
            query.set("search", filters.search);
        }

        if (filters.category_id) {
            query.set("category_id", String(filters.category_id));
        }

        if (filters.min_price !== undefined) {
            query.set("min_price", String(filters.min_price));
        }

        if (filters.max_price !== undefined) {
            query.set("max_price", String(filters.max_price));
        }

        if (filters.in_stock !== undefined) {
            query.set("in_stock", String(filters.in_stock));
        }

        if (filters.sort_by) {
            query.set("sort_by", filters.sort_by);
        }

        query.set("per_page", String(data.meta.per_page));
        query.set("page", String(page));

        return `/products?${query.toString()}`;
    }

    return (
        <main
            dir="rtl"
            className="mx-auto w-full max-w-7xl p-6"
        >
            <h1 className="mb-8 text-2xl font-bold">
                محصولات فروشگاه
            </h1>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">

                {/* فیلترها - ستون سمت راست */}
                <aside className="w-full lg:sticky lg:top-6">
                    <ProductsFilters categories={categories} />
                </aside>

                {/* محصولات - ستون سمت چپ */}
                <section className="min-w-0">

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground">
                            {data.meta.total.toLocaleString("fa-IR")} محصول پیدا شد
                        </p>

                        <p className="text-sm text-muted-foreground">
                            صفحه{" "}
                            {data.meta.current_page.toLocaleString("fa-IR")} از{" "}
                            {totalPages.toLocaleString("fa-IR")}
                        </p>
                    </div>

                    {data.products.length === 0 ? (
                        <div className="rounded-xl border py-16 text-center">
                            <p className="text-lg font-medium">
                                محصولی پیدا نشد
                            </p>

                            <p className="mt-2 text-sm text-muted-foreground">
                                فیلترها یا عبارت جستجو را تغییر دهید.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                            {data.products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Pagination className="mt-8">
                            <PaginationContent>
                                {data.links.prev && currentPage > 1 && (
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={getPageHref(currentPage - 1)}
                                            text="صفحه قبل"
                                        />
                                    </PaginationItem>
                                )}

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1,
                                ).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href={getPageHref(page)}
                                            isActive={page === currentPage}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                {data.links.next && currentPage < totalPages && (
                                    <PaginationItem>
                                        <PaginationNext
                                            href={getPageHref(currentPage + 1)}
                                            text="صفحه بعد"
                                        />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    )}

                </section>
            </div>
        </main>
    );
}

export default function ProductsPage({ searchParams }: Props) {
    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsContent searchParams={searchParams} />
        </Suspense>
    );
}
