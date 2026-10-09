import ProductCard from "@/components/ProductCard";
import Productsdetails from "@/components/Productsdetails";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductPage({ params }: Props) {
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