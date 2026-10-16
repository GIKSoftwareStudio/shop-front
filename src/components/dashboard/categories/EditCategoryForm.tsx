"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, LoaderCircle, Save } from "lucide-react";

import { updateAdminCategory } from "@/api/admin/categories";
import type { Category } from "@/api/admin/categories";

type EditCategoryFormProps = {
    category: Category;
};

export default function EditCategoryForm({
                                             category,
                                         }: EditCategoryFormProps) {
    const router = useRouter();

    const [name, setName] = useState(category.name);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("نام دسته‌بندی را وارد کن.");
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            await updateAdminCategory(category.id, {
                name: trimmedName,
            });

            router.push("/dashboard/categories");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "ویرایش دسته‌بندی ناموفق بود.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div dir="rtl" className="mx-auto max-w-2xl space-y-6">
            <div>
                <h2 className="text-lg font-semibold">
                    اطلاعات دسته‌بندی
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    نام دسته‌بندی را تغییر بده و ذخیره کن.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border bg-card p-5 sm:p-6"
            >
                <div className="space-y-2">
                    <label
                        htmlFor="category-name"
                        className="text-sm font-medium"
                    >
                        نام دسته‌بندی
                    </label>

                    <input
                        id="category-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="مثلاً انگشتر"
                        maxLength={100}
                        required
                        className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                    >
                        {error}
                    </p>
                )}

                <div className="flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}

                        {isSubmitting
                            ? "در حال ذخیره..."
                            : "ذخیره تغییرات"}
                    </button>

                    <Link
                        href="/dashboard/categories"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm transition hover:bg-muted"
                    >
                        <ArrowRight className="size-4" />
                        بازگشت
                    </Link>
                </div>
            </form>
        </div>
    );
}