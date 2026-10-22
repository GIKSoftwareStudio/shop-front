import { apiRequest } from "@/api/store/client";

export type ProductImage = {
    id: number;
    image_url: string;
    is_primary: number | boolean;
};

export type ProductCategory = {
    id: number;
    name: string;
    created_at?: string;
};

export type Product = {
    id: number;
    title: string;
    price: number;
    stock: number;
    category: ProductCategory;
    images?: ProductImage[];
    created_at?: string;
};

export type PaginatedProducts = {
    products: Product[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

export function getProducts(page = 1) {
    return apiRequest<PaginatedProducts>(`products?page=${page}`, {
        cache: "no-store",
    });
}

export function getProductImage(product: Product) {
    const images = Array.isArray(product?.images)
        ? product.images
        : [];

    return (
        images.find((image) => Boolean(image.is_primary))?.image_url ??
        images[0]?.image_url ??
        "/images/product-placeholder.png"
    );
}