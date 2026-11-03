"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/api/store/products";
import { getProductImage } from "@/api/store/products";

type ProductsdetailsProps = {
    product: Product;
};

export default function Productsdetails({
                                            product,
                                        }: ProductsdetailsProps) {
    const defaultImage = getProductImage(product);
    const imagesList = product.images && product.images.length > 0
        ? product.images.map((img) => img.image_url)
        : [defaultImage];

    const [selectedImage, setSelectedImage] = useState(imagesList[0]);

    function handleNextImage() {
        const currentIndex = imagesList.indexOf(selectedImage);
        const nextIndex = (currentIndex + 1) % imagesList.length;
        setSelectedImage(imagesList[nextIndex]);
    }

    function handlePrevImage() {
        const currentIndex = imagesList.indexOf(selectedImage);
        const prevIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
        setSelectedImage(imagesList[prevIndex]);
    }

    const categoryName =
        product.category &&
        typeof product.category === "object" &&
        "name" in product.category
            ? String(product.category.name ?? "بدون دسته‌بندی")
            : "بدون دسته‌بندی";

    return (
        <section
            dir="rtl"
            className="grid gap-8 md:grid-cols-2"
        >
            <div className="flex flex-col gap-4">
                <div className="relative group flex items-center justify-center rounded-2xl bg-muted/30 p-6">
                    <img
                        src={selectedImage}
                        alt={product.title}
                        className="aspect-square w-full max-w-md rounded-xl object-contain transition-all duration-300"
                    />

                    {imagesList.length > 1 && (
                        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                type="button"
                                onClick={handlePrevImage}
                                className="flex size-10 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 dark:bg-slate-900/95 dark:text-white"
                                aria-label="تصویر قبلی"
                            >
                                <ChevronRight className="size-5" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNextImage}
                                className="flex size-10 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 dark:bg-slate-900/95 dark:text-white"
                                aria-label="تصویر بعدی"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                        </div>
                    )}
                </div>
                {imagesList.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {imagesList.map((imgUrl, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedImage(imgUrl)}
                                className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                                    selectedImage === imgUrl
                                        ? "border-blue-600 shadow-md ring-2 ring-blue-600/20"
                                        : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                                }`}
                            >
                                <img
                                    src={imgUrl}
                                    alt={`${product.title} - تصویر ${index + 1}`}
                                    className="size-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-5">
                <h1 className="text-3xl font-bold">
                    {product.title}
                </h1>

                <p className="text-sm text-muted-foreground">
                    دسته‌بندی: {categoryName}
                </p>

                <p className="text-2xl font-bold">
                    {Number(product.price).toLocaleString("fa-IR")} تومان
                </p>

                <div className="border-t pt-5">
                    <p className="text-sm text-muted-foreground">
                        شناسه محصول: {product.id}
                    </p>
                </div>
            </div>
        </section>
    );
}