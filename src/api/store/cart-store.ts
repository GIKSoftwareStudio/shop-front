"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Product } from "@/api/store/products";
import { getProductImage } from "@/api/store/products";
import { apiRequest } from "@/api/store/client";

export type CartItem = {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
};

export type AddItemResult =
    | { ok: true }
    | {
          ok: false;
          reason: "network" | "out_of_stock" | "insufficient";
          message: string;
      };

type CartStore = {
    items: CartItem[];

    addItem: (product: Product) => Promise<AddItemResult>;
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
        (set, get) => ({
            items: [],

            // موجودی زنده را قبل از اضافه کردن از سرور میگیریم. فقط در صورتی
            // که موجودی واقعی کافی باشد آیتم وارد سبد میشود.
            addItem: async (product) => {
                let freshProduct: Product;

                try {
                    const response = await apiRequest<
                        Product & { data?: Product }
                    >(`products/${product.id}`, { cache: "no-store" });

                    const resolved = response?.data ?? response;

                    if (
                        !resolved ||
                        typeof resolved !== "object" ||
                        !resolved.id
                    ) {
                        throw new Error("پاسخ نامعتبر محصول");
                    }

                    freshProduct = resolved;
                } catch {
                    return {
                        ok: false,
                        reason: "network",
                        message:
                            "امکان بررسی موجودی وجود ندارد. دوباره تلاش کنید.",
                    };
                }

                const stock = getStock(freshProduct);

                if (stock <= 0) {
                    return {
                        ok: false,
                        reason: "out_of_stock",
                        message: "این محصول ناموجود است.",
                    };
                }

                const currentQuantity =
                    get().items.find((item) => item.id === product.id)
                        ?.quantity ?? 0;

                if (currentQuantity >= stock) {
                    return {
                        ok: false,
                        reason: "insufficient",
                        message: "موجودی محصول کافی نیست.",
                    };
                }

                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.id === product.id,
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? {
                                          ...item,
                                          title: freshProduct.title,
                                          price: Number(freshProduct.price),
                                          image: getProductImage(freshProduct),
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
                                id: freshProduct.id,
                                title: freshProduct.title,
                                price: Number(freshProduct.price),
                                image: getProductImage(freshProduct),
                                quantity: 1,
                                stock,
                            },
                        ],
                    };
                });

                return { ok: true };
            },

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