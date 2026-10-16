
import {
    ArrowRight,
    Image as ImageIcon,
} from "lucide-react";

import Link from "next/link";

function Skeleton({
    className,
}: {
    className: string;
}) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded-lg bg-muted ${className}`}
        />
    );
}

export default function ProductDetailsLoading() {
    return (
        <main
            dir="rtl"
            aria-busy="true"
            aria-label="در حال بارگذاری جزئیات محصول"
            className="mx-auto w-full max-w-5xl space-y-6"
        >
            {/* عنوان صفحه و دکمه‌ها */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-3">
                    <Link
                        href="/dashboard/products"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                    >
                        <ArrowRight className="size-4" />
                        بازگشت به محصولات
                    </Link>

                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-4 w-56" />
                </div>

                <Skeleton className="h-10 w-36" />
            </div>

            {/* محتوای اصلی */}
            <section className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                {/* تصویر محصول */}
                <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="flex aspect-square items-center justify-center bg-muted/30 p-4">
                        <div className="flex size-full items-center justify-center rounded-lg bg-muted/40">
                            <ImageIcon className="size-16 text-muted-foreground/40" />
                        </div>
                    </div>
                </div>

                {/* اطلاعات محصول */}
                <div className="space-y-5 rounded-xl border bg-card p-5 sm:p-6">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-7 w-3/4" />
                    </div>

                    {/* قیمت */}
                    <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-40" />
                    </div>

                    {/* دسته‌بندی و شناسه */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-3 rounded-lg border p-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-28" />
                        </div>

                        <div className="space-y-3 rounded-lg border p-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    </div>

                    {/* توضیحات */}
                    <div className="space-y-4 border-t pt-5">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>

                    {/* تاریخ ثبت */}
                    <div className="border-t pt-4">
                        <Skeleton className="h-4 w-44" />
                    </div>
                </div>
            </section>
        </main>
    );
}