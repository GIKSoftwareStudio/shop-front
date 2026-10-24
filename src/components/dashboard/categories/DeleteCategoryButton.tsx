
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteAdminCategory } from "@/api/admin/categories";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    const [open, setOpen] = useState(false);

    async function handleDelete() {
        if (isDeleting) return;

        setIsDeleting(true);

        try {
            await deleteAdminCategory(id);

            toast.success("دسته‌بندی با موفقیت حذف شد.");
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Delete category error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "حذف دسته‌بندی ناموفق بود.",
            );
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                    />
                }
            >
                <Trash2 className="size-4" />
                حذف
            </AlertDialogTrigger>

            <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        حذف دسته‌بندی
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        آیا از حذف دسته‌بندی «{name}» مطمئن هستید؟
                        این عملیات ممکن است قابل بازگشت نباشد.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        انصراف
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={isDeleting}
                        onClick={(event) => {
                            event.preventDefault();
                            void handleDelete();
                        }}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {isDeleting ? (
                            <>
                                <LoaderCircle className="size-4 animate-spin" />
                                در حال حذف...
                            </>
                        ) : (
                            <>
                                <Trash2 className="size-4" />
                                بله، حذف شود
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
