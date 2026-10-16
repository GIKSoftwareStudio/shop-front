
import Link from "next/link";
import type { Product } from "@/api/store/products";
import { getProductImage } from "@/api/store/products";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = getProductImage(product);

    return (
        <Link
            href={`/products/${product.id}`}
            dir="rtl"
            className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg"
        >
            <div className="aspect-square overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="text-sm text-muted-foreground">
                    {product.category?.name ?? "بدون دسته‌بندی"}
                </p>

                <h2 className="line-clamp-2 font-semibold leading-7">
                    {product.title}
                </h2>

                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-bold">
            {Number(product.price).toLocaleString("fa-IR")} تومان
          </span>

                    <span className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
            مشاهده محصول
          </span>
                </div>
            </div>
        </Link>
    );
}
