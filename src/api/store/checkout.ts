
import { apiRequest } from "@/api/store/client";

export type CheckoutInput = {
    items: {
        product_id: number;
        quantity: number;
    }[];
};

export type CheckoutResponse = {
    message: string;
    order: {
        id: number;
        total_amount: string | number;
        status: string;
        payment_token: string;
    };
    payment_url: string;
};

export function createCheckout(data: CheckoutInput) {
    return apiRequest<CheckoutResponse>("checkout", {
        method: "POST",
        body: data,
    });
}
