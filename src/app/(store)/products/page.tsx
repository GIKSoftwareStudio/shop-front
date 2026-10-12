import { Suspense } from "react";
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
    return <p className="py-8 text-center">Loading products...</p>;
}

async function ProductsContent({ searchParams }: Props) {
    const params = await searchParams;

    const requestedPage = Number(params.page) || 1;
    const currentPage = Math.max(1, requestedPage);
    const limit = 20;
    const skip = (currentPage - 1) * limit;

    const response = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
        { cache: "force-cache" }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    const totalPages = Math.ceil(data.total / limit);

    return (
        <main>
            <h1>Products</h1>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {data.products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

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