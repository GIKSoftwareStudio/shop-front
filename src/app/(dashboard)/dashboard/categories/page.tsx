import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import CategoriesContent from "@/components/dashboard/categories/CategoriesContent";

function CategoriesLoading() {
    return (
        <div dir="rtl" className="space-y-6">
            <div className="h-20 animate-pulse rounded-xl border bg-muted/50" />

            <div className="overflow-hidden rounded-xl border">
                <div className="h-12 animate-pulse bg-muted" />

                {Array.from({ length: 5 }, (_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 border-t p-4"
                    >
                        <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminCategoriesPage() {
    return (
        <section dir="rtl" className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    مدیریت دسته‌بندی‌ها
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    مشاهده و مدیریت دسته‌بندی‌های فروشگاه
                </p>
            </div>

            <div className="flex justify-start">
                <Link
                    href="/dashboard/categories/create"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    <Plus className="size-4" />
                    افزودن دسته‌بندی
                </Link>
            </div>

            <Suspense fallback={<CategoriesLoading />}>
                <CategoriesContent />
            </Suspense>
        </section>
    );
}