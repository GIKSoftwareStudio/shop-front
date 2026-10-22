"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Product } from "@/api/store/products";
import { getProductImage } from "@/api/store/products";

export type CartItem = {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
};

type CartStore = {
    items: CartItem[];

    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
};

function getStock(product: Product): number {
    const stock = Number(product.stock);

    if (!Number.isFinite(stock)) {
        return 0;
    }

    return Math.max(0, Math.floor(stock));
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],

            addItem: (product) =>
                set((state) => {
                    const stock = getStock(product);

                    if (stock <= 0) {
                        return state;
                    }

                    const existingItem = state.items.find(
                        (item) => item.id === product.id,
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? {
                                        ...item,
                                        title: product.title,
                                        price: Number(product.price),
                                        image: getProductImage(product),
                                        stock,
                                        quantity: Math.min(
                                            item.quantity + 1,
                                            stock,
                                        ),
                                    }
                                    : item,
                            ),
                        };
                    }

                    return {
                        items: [
                            ...state.items,
                            {
                                id: product.id,
                                title: product.title,
                                price: Number(product.price),
                                image: getProductImage(product),
                                quantity: 1,
                                stock,
                            },
                        ],
                    };
                }),

            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) => item.id !== productId,
                    ),
                })),

            updateQuantity: (productId, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter(
                                (item) => item.id !== productId,
                            ),
                        };
                    }

                    return {
                        items: state.items
                            .map((item) => {
                                if (item.id !== productId) {
                                    return item;
                                }

                                // پشتیبانی از آیتم‌های قدیمی ذخیره‌شده
                                // که هنوز فیلد stock ندارند.
                                if (
                                    typeof item.stock !== "number" ||
                                    !Number.isFinite(item.stock)
                                ) {
                                    if (quantity > item.quantity) {
                                        return item;
                                    }

                                    return { ...item, quantity };
                                }

                                const stock = Math.max(
                                    0,
                                    Math.floor(item.stock),
                                );

                                return {
                                    ...item,
                                    stock,
                                    quantity: Math.min(quantity, stock),
                                };
                            })
                            .filter((item) => item.quantity > 0),
                    };
                }),

            clearCart: () => set({ items: [] }),
        }),
        {
            name: "shop-front-cart",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
            partialize: (state) => ({
                items: state.items,
            }),
        },
    ),
);

export const selectTotalItems = (state: CartStore) =>
    state.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state: CartStore) =>
    state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );