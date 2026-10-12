import { Suspense } from "react";
import Productsdetails from "@/components/Productsdetails";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

function ProductLoading() {
    return (
        <main className="p-6">
            <p>Loading product...</p>
        </main>
    );
}

async function ProductContent({ params }: Props) {
    const { id } = await params;

    const response = await fetch(
        `https://dummyjson.com/products/${id}`,
        {
            cache: "force-cache",
        }
    );

    if (!response.ok) {
        throw new Error("Product not found");
    }

    const product = await response.json();

    return (
        <main className="p-6">
            <Productsdetails
                key={product.id}
                product={product}
            />
        </main>
    );
}

export default function ProductPage({ params }: Props) {
    return (
        <Suspense fallback={<ProductLoading />}>
            <ProductContent params={params} />
        </Suspense>
    );
}