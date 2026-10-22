import type { Product } from "@/api/store/products";
import { getProductImage } from "@/api/store/products";

type ProductsdetailsProps = {
    product: Product;
};

export default function Productsdetails({
                                            product,
                                        }: ProductsdetailsProps) {
    const image = getProductImage(product);

    const categoryName =
        product.category &&
        typeof product.category === "object" &&
        "name" in product.category
            ? String(product.category.name ?? "بدون دسته‌بندی")
            : "بدون دسته‌بندی";

    return (
        <section
            dir="rtl"
            className="grid gap-8 md:grid-cols-2"
        >
            <div className="flex items-center justify-center rounded-2xl bg-muted/30 p-6">
                <img
                    src={image}
                    alt={product.title}
                    className="aspect-square w-full max-w-md rounded-xl object-contain"
                />
            </div>

            <div className="space-y-5">
                <h1 className="text-3xl font-bold">
                    {product.title}
                </h1>

                <p className="text-sm text-muted-foreground">
                    دسته‌بندی: {categoryName}
                </p>

                <p className="text-2xl font-bold">
                    {Number(product.price).toLocaleString("fa-IR")} تومان
                </p>

                <div className="border-t pt-5">
                    <p className="text-sm text-muted-foreground">
                        شناسه محصول: {product.id}
                    </p>
                </div>
            </div>
        </section>
    );
}