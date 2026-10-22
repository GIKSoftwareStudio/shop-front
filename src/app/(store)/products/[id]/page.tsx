import { Suspense } from "react";
import { apiRequest } from "@/api/store/client";
import type { Product } from "@/api/store/products";
import Productsdetails from "@/components/Productsdetails";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

function ProductLoading() {
    return (
        <main dir="rtl" className="mx-auto max-w-7xl p-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
                <div className="space-y-4">
                    <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-1/3 animate-pulse rounded bg-muted" />
                </div>
            </div>
        </main>
    );
}

async function ProductContent({ params }: Props) {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId < 1) {
        return (
            <main dir="rtl" className="mx-auto max-w-7xl p-6">
                <h1 className="text-xl font-bold">
                    شناسه محصول معتبر نیست.
                </h1>
            </main>
        );
    }

    let product: Product;

    try {
        const response = await apiRequest<Product>(
            `products/${productId}`,
            { cache: "no-store" }
        );

        console.log(
            "Product API response:",
            JSON.stringify(response, null, 2)
        );

        // پشتیبانی از پاسخ مستقیم و پاسخ دارای data
        const result = (
            response as Product & { data?: Product }
        ).data ?? response;

        if (!result || typeof result !== "object" || !result.id) {
            throw new Error("پاسخ API محصول معتبر نیست.");
        }

        product = result;
    } catch (error) {
        console.error("Product API error:", error);

        return (
            <main dir="rtl" className="mx-auto max-w-7xl p-6">
                <h1 className="text-xl font-bold">
                    دریافت محصول ناموفق بود
                </h1>
                <p className="mt-3 text-muted-foreground">
                    اتصال بک‌اند یا پاسخ API را بررسی کنید.
                </p>
            </main>
        );
    }

    return (
        <main dir="rtl" className="mx-auto max-w-7xl p-6">
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