"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deleteAdminCategory } from "@/api/admin/categories";

type DeleteCategoryButtonProps = {
    id: number;
    name: string;
};

export default function DeleteCategoryButton({
                                                 id,
                                                 name,
                                             }: DeleteCategoryButtonProps) {
    const router = useRouter();

    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        const confirmed = window.confirm(
            `آیا مطمئنی که می‌خواهی دسته‌بندی «${name}» را حذف کنی؟`,
        );

        if (!confirmed) return;

        setError("");
        setIsDeleting(true);

        try {
            await deleteAdminCategory(id);
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "حذف دسته‌بندی ناموفق بود.",
            );
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="space-y-2">
            <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-destructive/30 px-3 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isDeleting ? (
                    <LoaderCircle className="size-4 animate-spin" />
                ) : (
                    <Trash2 className="size-4" />
                )}

                {isDeleting ? "در حال حذف..." : "حذف"}
            </button>

            {error && (
                <p role="alert" className="max-w-48 text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}