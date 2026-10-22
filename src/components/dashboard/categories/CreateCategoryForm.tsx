"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Plus } from "lucide-react";

import { createAdminCategory } from "@/api/admin/categories";

export default function CreateCategoryForm() {
    const router = useRouter();

    const [name, setName] = useState("");
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
            await createAdminCategory({ name: trimmedName });

            router.push("/dashboard/categories");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "ثبت دسته‌بندی انجام نشد.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div dir="rtl" className="mx-auto max-w-2xl space-y-6">
            <div>
                <h2 className="text-lg font-semibold">اطلاعات دسته‌بندی</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    نام دسته‌بندی جدید فروشگاه را وارد کن.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border bg-card p-5 sm:p-6"
            >
                <div className="space-y-2">
                    <label htmlFor="category-name" className="text-sm font-medium">
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
                        autoFocus
                        className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />

                    <p className="text-xs text-muted-foreground">
                        نامی کوتاه و قابل‌فهم برای مشتریان انتخاب کن.
                    </p>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                    >
                        {error}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <LoaderCircle className="size-4 animate-spin" />
                        ) : (
                            <Plus className="size-4" />
                        )}
                        {isSubmitting ? "در حال ثبت..." : "ثبت دسته‌بندی"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/categories")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm transition hover:bg-muted"
                    >
                        <ArrowRight className="size-4" />
                        بازگشت
                    </button>
                </div>
            </form>
        </div>
    );
}