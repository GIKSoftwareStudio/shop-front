import Link from "next/link";
import { RefreshCw } from "lucide-react";

import {
    getAdminCategories,
    type Category,
} from "@/api/admin/categories";

import CategoriesTable from "@/components/dashboard/categories/CategoriesTable";

type CategoriesResponse =
    | Category[]
    | {
    categories?: Category[];
    data?: Category[];
};

export default async function CategoriesContent() {
    let categories: Category[];

    try {
        const response = (await getAdminCategories()) as CategoriesResponse;

        categories = Array.isArray(response)
            ? response
            : response.data ?? response.categories ?? [];
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "خطای نامشخص در دریافت اطلاعات";

        return (
            <div
                dir="rtl"
                role="alert"
                className="space-y-3 rounded-xl border border-destructive/30 p-5"
            >
                <p className="font-semibold text-destructive">
                    دریافت دسته‌بندی‌ها ناموفق بود.
                </p>

                <p className="text-sm text-muted-foreground">{message}</p>

                <Link
                    href="/dashboard/categories"
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                >
                    <RefreshCw className="size-4" />
                    تلاش مجدد
                </Link>
            </div>
        );
    }

    return (
        <div dir="rtl" className="space-y-6">
            <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                    تعداد کل دسته‌بندی‌ها
                </p>

                <p className="mt-1 text-lg font-bold">
                    {categories.length.toLocaleString("fa-IR")}
                </p>
            </div>

            <CategoriesTable categories={categories} />
        </div>
    );
}