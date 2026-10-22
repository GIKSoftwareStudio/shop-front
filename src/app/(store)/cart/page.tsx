"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {useCartStore} from "@/api/store/cart-store";



function formatPrice(price: number) {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0,
    );

    const totalPrice = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );

    if (items.length === 0) {
        return (
            <main dir="rtl" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
                <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                        <ShoppingBag className="h-9 w-9 text-gray-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        سبد خرید شما خالی است
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-gray-500">
                        هنوز محصولی به سبد خرید اضافه نکرده‌اید.
                        محصولات فروشگاه را ببینید و خریدتان را شروع کنید.
                    </p>

                    <Link
                        href="/products"
                        className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        مشاهده محصولات
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main dir="rtl" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    سبد خرید
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    {new Intl.NumberFormat("fa-IR").format(totalItems)} عدد محصول در سبد خرید شما
                </p>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                <section className="space-y-4 lg:col-span-2">
                    {items.map((item) => (
                        <article
                            key={item.id}
                            className="flex min-w-0 gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:gap-5 sm:p-5"
                        >
                            <Link
                                href={`/products/${item.id}`}
                                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 640px) 96px, 128px"
                                    className="object-cover"
                                />
                            </Link>

                            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                                <div className="flex items-start justify-between gap-2">
                                    <Link
                                        href={`/products/${item.id}`}
                                        className="line-clamp-2 text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600 sm:text-base"
                                    >
                                        {item.title}
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id)}
                                        aria-label={`حذف ${item.title} از سبد خرید`}
                                        className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity + 1)
                                            }
                                            aria-label="افزایش تعداد"
                                            className="rounded-md p-1.5 transition hover:bg-gray-100"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>

                                        <span className="min-w-5 text-center text-sm font-semibold">
                                            {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity - 1)
                                            }
                                            aria-label="کاهش تعداد"
                                            className="rounded-md p-1.5 transition hover:bg-gray-100"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <p className="text-sm font-bold text-gray-900 sm:text-base">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}

                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 py-2 text-sm text-gray-600 transition hover:text-black"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        ادامه خرید
                    </Link>
                </section>

                <aside className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
                    <h2 className="text-lg font-bold text-gray-900">
                        خلاصه سفارش
                    </h2>

                    <div className="mt-6 space-y-4 text-sm">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500">تعداد محصولات</span>
                            <span className="font-medium">
                                {new Intl.NumberFormat("fa-IR").format(totalItems)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500">مجموع قیمت</span>
                            <span className="font-medium">
                                {formatPrice(totalPrice)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-gray-500">هزینه ارسال</span>
                            <span className="text-gray-500">
                                محاسبه در مرحله بعد
                            </span>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between gap-3">
                                <span className="font-semibold text-gray-900">
                                    مبلغ قابل پرداخت
                                </span>
                                <span className="text-base font-bold text-gray-900">
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/checkout"
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                        ادامه و تسویه حساب
                        <ArrowLeft className="h-4 w-4" />
                    </Link>

                    <p className="mt-4 text-center text-xs leading-6 text-gray-500">
                        هزینه ارسال و اطلاعات نهایی سفارش در مرحله بعد مشخص می‌شود.
                    </p>
                </aside>
            </div>
        </main>
    );
}
