import Link from "next/link";
import { Pencil, Tags } from "lucide-react";

import type { Category } from "@/api/admin/categories";
import DeleteCategoryButton from "./DeleteCategoryButton";

type CategoriesTableProps = {
    categories: Category[];
};

export default function CategoriesTable({
                                            categories = [],
                                        }: CategoriesTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-right text-sm">
                    <thead className="bg-muted/60">
                    <tr>
                        <th className="px-4 py-4 font-semibold">
                            شناسه
                        </th>

                        <th className="px-4 py-4 font-semibold">
                            نام دسته‌بندی
                        </th>

                        <th className="px-4 py-4 font-semibold">
                            تاریخ ایجاد
                        </th>

                        <th className="px-4 py-4 font-semibold">
                            عملیات
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {categories.map((category) => (
                        <tr
                            key={category.id}
                            className="border-t transition-colors hover:bg-muted/30"
                        >
                            <td className="px-4 py-4">
                                {category.id.toLocaleString("fa-IR")}
                            </td>

                            <td className="px-4 py-4 font-medium">
                                {category.name}
                            </td>

                            <td className="px-4 py-4 text-muted-foreground">
                                {category.created_at
                                    ? new Date(
                                        category.created_at,
                                    ).toLocaleDateString("fa-IR")
                                    : "—"}
                            </td>

                            <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/dashboard/categories/${category.id}/edit`}
                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted"
                                        aria-label={`ویرایش ${category.name}`}
                                    >
                                        <Pencil className="size-4" />
                                        ویرایش
                                    </Link>

                                    <DeleteCategoryButton
                                        id={category.id}
                                        name={category.name}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}

                    {categories.length === 0 && (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-4 py-12 text-center"
                            >
                                <Tags className="mx-auto mb-3 size-9 text-muted-foreground" />

                                <p className="font-medium">
                                    هنوز دسته‌بندی‌ای ثبت نشده است.
                                </p>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    دسته‌بندی‌های فروشگاه در این قسمت نمایش داده می‌شوند.
                                </p>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}