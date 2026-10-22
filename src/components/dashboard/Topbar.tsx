
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbLabels: Record<string, string> = {
    dashboard: "Overview",
    orders: "My Orders",
    profile: "Profile",
    settings: "Settings",
};

export default function Topbar() {
    const pathname = usePathname();

    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => ({
        label:
            breadcrumbLabels[segment] ??
            segment.charAt(0).toUpperCase() + segment.slice(1),
        href: `/${segments.slice(0, index + 1).join("/")}`,
        isLast: index === segments.length - 1,
    }));

    return (
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 text-sm">
                    {breadcrumbs.map((item, index) => (
                        <li key={item.href} className="flex items-center gap-2">
                            {index > 0 && (
                                <span className="text-muted-foreground" aria-hidden="true">
                  /
                </span>
                            )}

                            {item.isLast ? (
                                <span
                                    aria-current="page"
                                    className="font-medium text-foreground"
                                >
                  {item.label}
                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Quick actions */}
            <div className="flex shrink-0 items-center gap-2">
                <Link
                    href="/products"
                    className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                    Browse products
                </Link>

                <Link
                    href="/dashboard/profile"
                    className="rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                    My profile
                </Link>
            </div>
        </header>
    );
}
