import Link from "next/link";
import { ArrowRight } from "lucide-react";

import CreateCategoryForm from "@/components/dashboard/categories/CreateCategoryForm";

export default function CreateCategoryPage() {
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
                        افزودن دسته‌بندی
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        یک دسته‌بندی جدید به فروشگاه اضافه کن.
                    </p>
                </div>
            </div>

            <CreateCategoryForm />
        </section>
    );
}