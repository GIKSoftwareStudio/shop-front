
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { createCheckout } from "@/api/store/checkout";
import {
    useCartStore,
    selectTotalItems,
    selectTotalPrice,
} from "@/api/store/cart-store";

function formatPrice(price: number) {
    return `${price.toLocaleString("fa-IR")} تومان`;
}

export default function CheckoutPage() {
    const router = useRouter();

    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const totalItems = useCartStore(selectTotalItems);
    const totalPrice = useCartStore(selectTotalPrice);

    const [hydrated, setHydrated] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        useCartStore.persist.rehydrate();
        setHydrated(true);
    }, []);

    const checkoutItems = useMemo(
        () =>
            items.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
        [items],
    );

    async function handleCheckout() {
        if (submitting) return;

        if (checkoutItems.length === 0) {
            toast.error("سبد خرید شما خالی است.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await createCheckout({
                items: checkoutItems,
            });

            clearCart();

            toast.success(
                response.message || "سفارش با موفقیت ثبت شد.",
            );

            const paymentUrl = new URL(
                response.payment_url,
                window.location.origin,
            );

            // Only navigate to the configured backend origin or
            // the current frontend origin.
            const backendOrigin = new URL(
                process.env.NEXT_PUBLIC_API_BASE_URL ??
                "http://192.168.100.77:8000/api",
            ).origin;

            if (
                paymentUrl.origin !== backendOrigin &&
                paymentUrl.origin !== window.location.origin
            ) {
                throw new Error("آدرس پرداخت معتبر نیست.");
            }

            window.location.assign(paymentUrl.toString());
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "ثبت سفارش انجام نشد. دوباره تلاش کنید.",
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (!hydrated) {
        return (
            <main dir="rtl" className="mx-auto max-w-5xl px-4 py-12">
                <div className="animate-pulse rounded-xl border p-8 text-center text-muted-foreground">
                    در حال بارگذاری سبد خرید...
                </div>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main dir="rtl" className="mx-auto max-w-5xl px-4 py-12">
                <div className="rounded-2xl border bg-card px-6 py-12 text-center">
                    <ShoppingBag className="mx-auto mb-4 size-12 text-muted-foreground" />

                    <h1 className="text-2xl font-bold">
                        سبد خرید شما خالی است
                    </h1>

                    <p className="mt-3 text-muted-foreground">
                        برای ثبت سفارش، ابتدا محصولی به سبد خرید اضافه کنید.
                    </p>

                    <Link
                        href="/products"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground hover:opacity-90"
                    >
                        مشاهده محصولات
                        <ArrowLeft className="size-4" />
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main dir="rtl" className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold sm:text-3xl">
                    تکمیل سفارش
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    سفارش خود را بررسی کنید و برای پرداخت ادامه دهید.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <section className="overflow-hidden rounded-2xl border bg-card">
                    <div className="border-b p-5">
                        <h2 className="font-semibold">
                            خلاصه محصولات
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {totalItems.toLocaleString("fa-IR")} عدد محصول
                        </p>
                    </div>

                    <div className="divide-y">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-5"
                            >
                                {item.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="size-20 shrink-0 rounded-xl border object-cover"
                                    />
                                ) : (
                                    <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-muted">
                                        <ShoppingBag className="size-7 text-muted-foreground" />
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-medium">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        تعداد:{" "}
                                        {item.quantity.toLocaleString("fa-IR")}
                                    </p>
                                </div>

                                <p className="whitespace-nowrap text-sm font-semibold">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t p-5">
                        <Link
                            href="/cart"
                            className="text-sm text-primary hover:underline"
                        >
                            بازگشت به سبد خرید و ویرایش اقلام
                        </Link>
                    </div>
                </section>

                <aside className="h-fit rounded-2xl border bg-card p-5">
                    <h2 className="text-lg font-semibold">
                        مبلغ سفارش
                    </h2>

                    <div className="mt-5 flex justify-between gap-3 text-sm">
                        <span className="text-muted-foreground">
                            تعداد اقلام
                        </span>
                        <span>
                            {totalItems.toLocaleString("fa-IR")}
                        </span>
                    </div>

                    <div className="mt-4 flex justify-between gap-3">
                        <span className="text-muted-foreground">
                            جمع سبد خرید
                        </span>
                        <span className="font-semibold">
                            {formatPrice(totalPrice)}
                        </span>
                    </div>

                    <div className="my-5 border-t" />

                    <p className="text-xs leading-6 text-muted-foreground">
                        مبلغ نهایی و موجودی کالاها هنگام ثبت سفارش در سرور
                        بررسی می‌شوند. مبلغ نمایش‌داده‌شده ممکن است با قیمت
                        نهایی سرور تفاوت داشته باشد.
                    </p>

                    <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={submitting || items.length === 0}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? (
                            <>
                                <LoaderCircle className="size-5 animate-spin" />
                                در حال ثبت سفارش...
                            </>
                        ) : (
                            <>
                                ثبت سفارش و پرداخت
                                <ArrowLeft className="size-4" />
                            </>
                        )}
                    </button>
                </aside>
            </div>
        </main>
    );
}
