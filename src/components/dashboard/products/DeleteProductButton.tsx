
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteAdminProduct } from "@/api/admin/products";
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

type Props = {
    productId: number;
    productName: string;
};

export default function DeleteProductButton({
                                                productId,
                                                productName,
                                            }: Props) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [open, setOpen] = useState(false);

    async function handleDelete() {
        if (isDeleting) return;

        setIsDeleting(true);

        try {
            await deleteAdminProduct(productId);

            toast.success("محصول با موفقیت حذف شد.");
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Delete product error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "حذف محصول ناموفق بود.",
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
                        حذف محصول
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        آیا از حذف محصول «{productName}» مطمئن هستید؟
                        این عملیات قابل بازگشت نیست.
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
