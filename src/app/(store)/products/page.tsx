
import { Suspense } from "react";
import { getProducts } from "@/api/store/products";
import ProductCard from "@/components/ProductCard";
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
        page?: string;
    }>;
};

function ProductsLoading() {
    return (
        <main
            dir="rtl"
            className="mx-auto w-full max-w-7xl p-6"
        >
            <div className="mb-8 h-8 w-48 animate-pulse rounded bg-muted" />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
        </main>
    );
}

async function ProductsContent({ searchParams }: Props) {
    const params = await searchParams;
    const parsedPage = Number(params.page);

    const currentPage =
        Number.isInteger(parsedPage) && parsedPage > 0
            ? parsedPage
            : 1;

    let data;

    try {
        data = await getProducts(currentPage);
    } catch (error) {
        console.error("Products API error:", error);

        return (
            <main
                dir="rtl"
                className="mx-auto max-w-7xl p-6"
            >
                <h1 className="text-2xl font-bold">
                    محصولات فروشگاه
                </h1>

                <p className="mt-4 text-destructive">
                    دریافت محصولات ناموفق بود. اتصال بک‌اند و آدرس API را بررسی کنید.
                </p>
            </main>
        );
    }

    const totalPages = data.meta.last_page;

    return (
        <main
            dir="rtl"
            className="mx-auto w-full max-w-7xl p-6"
        >
            <h1 className="mb-8 text-2xl font-bold">
                محصولات فروشگاه
            </h1>

            {data.products.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                    محصولی برای نمایش وجود ندارد.
                </p>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    href={`/products?page=${currentPage - 1}`}
                                />
                            </PaginationItem>
                        )}

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href={`/products?page=${page}`}
                                    isActive={page === currentPage}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationNext
                                    href={`/products?page=${currentPage + 1}`}
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            )}
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
