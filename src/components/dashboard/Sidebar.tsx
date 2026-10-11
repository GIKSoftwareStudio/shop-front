
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    { label: "Overview", href: "/dashboard" },
    { label: "My Orders", href: "/dashboard/orders" },
    { label: "Profile", href: "/dashboard/profile" },
    { label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="border-b bg-background md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
            <div className="p-4 md:p-6">
                <h2 className="mb-4 text-xl font-bold">Dashboard</h2>

                <nav
                    aria-label="Dashboard navigation"
                    className="flex gap-2 overflow-x-auto md:flex-col"
                >
                    {navigation.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" &&
                                pathname.startsWith(`${item.href}/`));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive ? "page" : undefined}
                                className={`shrink-0 rounded-md px-3 py-2 text-sm transition-colors ${
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
