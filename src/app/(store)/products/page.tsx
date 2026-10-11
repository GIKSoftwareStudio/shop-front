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

export default async function Home({ searchParams }: Props) {
    const params = await searchParams;

    const currentPage = Number(params.page) || 1;

    const limit = 20;

    const skip = (currentPage - 1) * limit;

    const response = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
        {
            cache: "force-cache",
        }
    );

    const data = await response.json();

    const totalPages = Math.ceil(data.total / limit);

    return (
        <main>
            <h1>Products</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.products.map((product: any) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
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