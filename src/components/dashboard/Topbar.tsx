
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";

const breadcrumbLabels: Record<string, string> = {
    dashboard: "داشبورد",
    orders: "سفارش‌ها",
    products: "محصولات",
    categories: "دسته‌بندی‌ها",
    create: "ایجاد",
    edit: "ویرایش",
};

export default function Topbar() {
    const pathname = usePathname();

    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => ({
        label:
            breadcrumbLabels[segment] ??
            segment,
        href: `/${segments.slice(0, index + 1).join("/")}`,
        isLast: index === segments.length - 1,
    }));

    return (
        <div className="flex min-w-0 items-center justify-between gap-3">
            <nav
                aria-label="مسیر صفحه"
                className="min-w-0 overflow-x-auto"
            >
                <ol className="flex items-center gap-2 whitespace-nowrap text-sm">
                    {breadcrumbs.map((item, index) => (
                        <li
                            key={item.href}
                            className="flex items-center gap-2"
                        >
                            {index > 0 && (
                                <span
                                    aria-hidden="true"
                                    className="text-muted-foreground"
                                >
                                    /
                                </span>
                            )}

                            {item.isLast ? (
                                <span
                                    aria-current="page"
                                    className="font-semibold text-foreground"
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            <Link
                href="/products"
                className="inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
            >
                <span className="hidden sm:inline">مشاهده فروشگاه</span>
                <ExternalLink className="size-4" />
            </Link>
        </div>
    );
}
