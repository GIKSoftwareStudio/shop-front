
import { apiRequest } from "@/api/store/client";

export type AdminOrderStatus = "pending" | "paid" | "failed";

export type AdminOrderItem = {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    unit_price: string | number;
    created_at: string;
    updated_at: string;
};

export type AdminOrder = {
    id: number;
    user_id: number | null;
    total_amount: string | number;
    status: AdminOrderStatus | string;
    payment_token: string | null;
    created_at: string;
    updated_at: string;
    user: unknown | null;
    items: AdminOrderItem[];
};

export type AdminOrdersResponse = {
    current_page: number;
    data: AdminOrder[];
    last_page: number;
    per_page: number;
    total: number;
    first_page_url: string | null;
    last_page_url: string | null;
    next_page_url: string | null;
    prev_page_url: string | null;
};

export function getAdminOrders(page = 1) {
    return apiRequest<AdminOrdersResponse>(
        `admin/orders?page=${page}`,
        { cache: "no-store" },
    );
}
