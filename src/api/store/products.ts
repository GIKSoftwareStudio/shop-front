
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

export type ProductFilters = {
    search?: string;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    per_page?: number;
    page?: number;
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

export type StoreCategory = {
    id: number;
    name: string;
    created_at?: string;
};

type CategoriesResponse =
    | StoreCategory[]
    | { data: StoreCategory[] }
    | { categories: StoreCategory[] };

export async function getProducts(
    filters: ProductFilters = {},
): Promise<PaginatedProducts> {
    const params = new URLSearchParams();

    const {
        search,
        category_id,
        min_price,
        max_price,
        per_page = 20,
        page = 1,
    } = filters;

    if (search?.trim()) {
        params.set("search", search.trim());
    }

    if (category_id && category_id > 0) {
        params.set("category_id", String(category_id));
    }

    if (min_price !== undefined && min_price >= 0) {
        params.set("min_price", String(min_price));
    }

    if (max_price !== undefined && max_price >= 0) {
        params.set("max_price", String(max_price));
    }

    params.set("per_page", String(per_page));
    params.set("page", String(page));

    return apiRequest<PaginatedProducts>(
        `products?${params.toString()}`,
        {
            cache: "no-store",
        },
    );
}

export async function getStoreCategories(): Promise<StoreCategory[]> {
    const response = await apiRequest<CategoriesResponse>(
        "categories",
        {
            cache: "no-store",
        },
    );

    if (Array.isArray(response)) {
        return response;
    }

    if ("data" in response) {
        return response.data;
    }

    return response.categories;
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
