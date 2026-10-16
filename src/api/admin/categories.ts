import { apiRequest } from "@/api/store/client";

export type Category = {
    id: number;
    name: string;
    created_at?: string;
};

export type CreateCategoryInput = {
    name: string;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export function getAdminCategories() {
    return apiRequest<Category[] | { categories: Category[] }>(
        "admin/categories",
        { cache: "no-store" },
    );
}

export function getAdminCategory(id: number) {
    return apiRequest<Category | { category: Category }>(
        `admin/categories/${id}`,
        { cache: "no-store" },
    );
}

export function createAdminCategory(data: CreateCategoryInput) {
    return apiRequest<Category>("admin/categories", {
        method: "POST",
        body: data,
    });
}

export function updateAdminCategory(
    id: number,
    data: UpdateCategoryInput,
) {
    return apiRequest<Category>(`admin/categories/${id}`, {
        method: "PUT",
        body: data,
    });
}

export function deleteAdminCategory(id: number) {
    return apiRequest<void>(`admin/categories/${id}`, {
        method: "DELETE",
    });
}