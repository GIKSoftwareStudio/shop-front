import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import {
    getAdminCategory,
    type Category,
} from "@/api/admin/categories";

import EditCategoryForm from "@/components/dashboard/categories/EditCategoryForm";

type PageProps = {
    params: Promise<{ id: string }>;
};

type CategoryResponse =
    | Category
    | {
    category?: Category;
    data?: Category | { category?: Category };
};

function extractCategory(response: CategoryResponse): Category | undefined {
    if ("category" in response && response.category) {
        return response.category;
    }

    if ("data" in response && response.data) {
        const data = response.data;

        if ("category" in data && data.category) {
            return data.category;
        }

        if ("id" in data && typeof data.id === "number") {
            return data as Category;
        }
    }

    if ("id" in response && typeof response.id === "number") {
        return response as Category;
    }

    return undefined;
}

export default async function EditCategoryPage({ params }: PageProps) {
    const { id } = await params;

    if (!/^\d+$/.test(id)) {
        notFound();
    }

    let category: Category;

    try {
        const response = (await getAdminCategory(
            Number(id),
        )) as CategoryResponse;

        const result = extractCategory(response);

        if (!result || typeof result.id !== "number") {
            console.error("Unexpected category API response:", response);
            notFound();
        }

        category = result;
    } catch (error) {
        console.error("Failed to load category:", error);
        notFound();
    }

    return (
        <section dir="rtl" className="space-y-6">
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard/categories"
                    aria-label="بازگشت به دسته‌بندی‌ها"
                    className="flex size-10 items-center justify-center rounded-lg border transition hover:bg-muted"
                >
                    <ArrowRight className="size-5" />
                </Link>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        ویرایش دسته‌بندی
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        تغییر نام دسته‌بندی شماره{" "}
                        {category.id.toLocaleString("fa-IR")}
                    </p>
                </div>
            </div>

            <EditCategoryForm category={category} />
        </section>
    );
}