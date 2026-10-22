
import { apiRequest } from "@/api/store/client";

export type AdminProductImage = {
    id: number;
    image_url: string;
    is_primary: number | boolean;
};

export type AdminProductCategory = {
    id: number;
    name: string;
    created_at?: string;
};

export type AdminProduct = {
    id: number;
    title: string;
    price: number;
    category: AdminProductCategory | null;
    images: AdminProductImage[];
    stock?: number;
    description?: string;
    created_at?: string;
};

export type AdminProductsResponse = {
    data: AdminProduct[];
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

export type CreateProductInput = {
    name: string;
    category_id: number;
    description: string;
    price: number;
    stock: number;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export function getAdminProducts(page = 1) {
    return apiRequest<AdminProductsResponse>(
        `admin/products?page=${page}`,
        { cache: "no-store" },
    );
}

export function getAdminProduct(id: number) {
    return apiRequest<AdminProduct | { data: AdminProduct }>(
        `admin/products/${id}`,
        { cache: "no-store" },
    );
}

export function createAdminProduct(data: CreateProductInput) {
    return apiRequest<AdminProduct>("admin/products", {
        method: "POST",
        body: data,
    });
}

export function updateAdminProduct(
    id: number,
    data: UpdateProductInput,
) {
    return apiRequest<AdminProduct>(`admin/products/${id}`, {
        method: "PUT",
        body: data,
    });
}

export function deleteAdminProduct(id: number) {
    return apiRequest<void>(`admin/products/${id}`, {
        method: "DELETE",
    });
}
