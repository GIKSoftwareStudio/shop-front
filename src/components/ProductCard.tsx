
"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/api/store/products";
import { getProductImage } from "@/api/store/products";
import {useCartStore} from "@/api/store/cart-store";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
    const defaultImage = getProductImage(product);
    const imagesList = product.images && product.images.length > 0
        ? product.images.map((img) => img.image_url)
        : [defaultImage];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imageUrl = imagesList[currentImageIndex] ?? defaultImage;

    function handleNextImage(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
    }

    function handlePrevImage(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
    }

    const addItem = useCartStore((state) => state.addItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);

    const quantity = useCartStore(
        (state) =>
            state.items.find((item) => item.id === product.id)?.quantity ?? 0,
    );

    const formattedPrice = Number(product.price).toLocaleString("fa-IR");
    const isOutOfStock = product.stock <= 0;

    function handleAddToCart() {
        if (isOutOfStock) return;
        addItem(product);
        toast.success("محصول به سبد خرید اضافه شد");
    }

    function handleDecrease() {
        updateQuantity(product.id, quantity - 1);
    }

    function handleIncrease() {
        if (isOutOfStock) return;
        addItem(product);
    }

    return (
        <article
            dir="rtl"
            className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[2rem] sm:p-2.5 lg:rounded-[2.5rem] dark:border-slate-800 dark:bg-[#0B101B] dark:shadow-black/20"
        >
            {/* تصویر محصول */}
            <Link
                href={`/products/${product.id}`}
                aria-label={`مشاهده محصول ${product.title}`}
                className="relative block aspect-square w-full overflow-hidden rounded-xl bg-slate-100 sm:rounded-[1.5rem] lg:rounded-[2rem] dark:bg-[#151D2B]"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={product.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {imagesList.length > 1 && (
                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <button
                            type="button"
                            onClick={handlePrevImage}
                            className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow-md backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 dark:bg-slate-900/80 dark:text-white"
                            aria-label="تصویر قبلی"
                        >
                            <ChevronRight className="size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNextImage}
                            className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow-md backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 dark:bg-slate-900/80 dark:text-white"
                            aria-label="تصویر بعدی"
                        >
                            <ChevronLeft className="size-4" />
                        </button>
                    </div>
                )}
            </Link>

            {/* اطلاعات محصول */}
            <div className="flex min-w-0 flex-1 flex-col px-1 pb-1 pt-3 sm:px-3 sm:pb-3 sm:pt-4">
                <p className="mb-1 truncate text-[10px] font-medium text-[#1E3A8A] sm:text-xs dark:text-blue-400">
                    {product.category?.name ?? "بدون دسته‌بندی"}
                </p>

                <Link
                    href={`/products/${product.id}`}
                    className="min-w-0"
                >
                    <h2 className="line-clamp-2 text-sm font-bold leading-6 text-slate-900 transition-colors group-hover:text-blue-700 sm:text-base sm:leading-7 lg:text-lg dark:text-white dark:group-hover:text-blue-400">
                        {product.title}
                    </h2>
                </Link>

                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6 dark:text-slate-400">
                    مشاهده جزئیات و مشخصات این محصول در فروشگاه
                </p>

                {/* قیمت و کنترل سبد خرید */}
                <div className="mt-auto flex min-w-0 flex-col gap-3 border-t border-slate-100 pt-3 sm:mt-4 sm:gap-4 sm:pt-4 dark:border-slate-800">
                    <p className="min-w-0 text-sm font-extrabold leading-6 text-slate-900 sm:text-base lg:text-lg dark:text-white">
                        <span className="break-words">
                            {formattedPrice}
                        </span>
                        <span className="mr-1 text-[10px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
                            تومان
                        </span>
                    </p>

                    {isOutOfStock ? (
                        <div className="inline-flex min-h-10 w-full min-w-0 items-center justify-center gap-1 rounded-full bg-slate-100 px-2 py-2 text-[11px] font-medium text-slate-400 sm:gap-2 sm:px-4 sm:text-sm lg:px-5 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed">
                            <span className="truncate">
                                ناموجود
                            </span>
                        </div>
                    ) : quantity === 0 ? (
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="inline-flex min-h-10 w-full min-w-0 items-center justify-center gap-1 rounded-full bg-gradient-to-l from-[#1E3A8A] to-[#2563EB] px-2 py-2 text-[11px] font-medium text-white transition-all hover:brightness-110 active:scale-95 sm:gap-2 sm:px-4 sm:text-sm lg:px-5"
                        >
                            <ShoppingCart className="size-4 shrink-0" />
                            <span className="truncate">
                                افزودن به سبد
                            </span>
                        </button>
                    ) : (
                        <div className="flex min-h-10 w-full items-center justify-between gap-1 rounded-full border border-blue-200 bg-blue-50 p-1 dark:border-blue-900 dark:bg-blue-950/40">
                            <button
                                type="button"
                                onClick={handleIncrease}
                                aria-label={`افزایش تعداد ${product.title}`}
                                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 active:scale-95"
                            >
                                <Plus className="size-4" />
                            </button>

                            <span
                                aria-live="polite"
                                aria-label={`تعداد ${product.title}`}
                                className="min-w-0 flex-1 text-center text-sm font-bold text-blue-900 dark:text-blue-100"
                            >
                                {quantity.toLocaleString("fa-IR")}
                            </span>

                            <button
                                type="button"
                                onClick={handleDecrease}
                                aria-label={`کاهش تعداد ${product.title}`}
                                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700 transition-colors hover:bg-blue-100 active:scale-95 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-blue-950"
                            >
                                <Minus className="size-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}