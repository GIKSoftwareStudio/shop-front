
import { Suspense } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    RefreshCw,
} from "lucide-react";

import {
    getAdminOrders,
    type AdminOrder,
    type AdminOrderStatus,
} from "@/api/admin/orders";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type Props = {
    searchParams: Promise<{
        page?: string;
    }>;
};

const statusConfig: Record<
    AdminOrderStatus,
    { label: string; className: string }
> = {
    pending: {
        label: "در انتظار پرداخت",
        className: "bg-amber-100 text-amber-800",
    },
    paid: {
        label: "پرداخت‌شده",
        className: "bg-emerald-100 text-emerald-800",
    },
    failed: {
        label: "ناموفق",
        className: "bg-red-100 text-red-800",
    },
};

function formatAmount(amount: string | number) {
    return `${Number(amount).toLocaleString("fa-IR")} تومان`;
}

function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "نامشخص";
    }

    return new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(parsedDate);
}

function OrderStatus({ status }: { status: string }) {
    const config =
        statusConfig[status as AdminOrderStatus];

    if (!config) {
        return (
            <span className="text-sm text-muted-foreground">
                {status || "نامشخص"}
            </span>
        );
    }

    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    );
}

function OrdersLoading() {
    return (
        <div dir="rtl" className="space-y-4 p-6">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-64 animate-pulse rounded-xl border bg-muted/40" />
        </div>
    );
}

async function OrdersContent({ page }: { page: number }) {
    let orders: AdminOrder[];
    let currentPage: number;
    let totalPages: number;
    let totalOrders: number;

    try {
        const response = await getAdminOrders(page);

        orders = response.data;
        currentPage = response.current_page;
        totalPages = response.last_page;
        totalOrders = response.total;
    } catch {
        return (
            <div dir="rtl" className="p-6">
                <div className="rounded-xl border p-6 text-center">
                    <ClipboardList className="mx-auto mb-3 size-10 text-muted-foreground" />

                    <h2 className="text-lg font-semibold">
                        دریافت سفارش‌ها ناموفق بود
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        اتصال به API را بررسی کنید و دوباره تلاش کنید.
                    </p>

                    <Link
                        href={`/dashboard/orders?page=${page}`}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                    >
                        <RefreshCw className="size-4" />
                        تلاش مجدد
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div dir="rtl" className="space-y-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        مدیریت سفارش‌ها
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        مشاهده و بررسی سفارش‌های ثبت‌شده در فروشگاه
                    </p>
                </div>

                <div className="rounded-lg border bg-card px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                        تعداد کل سفارش‌ها
                    </p>
                    <p className="mt-1 text-xl font-bold">
                        {totalOrders.toLocaleString("fa-IR")}
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-card">
                <div className="overflow-x-auto">
                    <Table className="min-w-190 text-right">
                        <TableHeader>
                            <TableRow className="bg-muted/60 hover:bg-muted/60">
                                <TableHead className="text-right font-semibold">
                                    شماره سفارش
                                </TableHead>
                                <TableHead className="text-right font-semibold">
                                    تعداد اقلام
                                </TableHead>
                                <TableHead className="text-right font-semibold">
                                    مبلغ کل
                                </TableHead>
                                <TableHead className="text-right font-semibold">
                                    تاریخ ثبت
                                </TableHead>
                                <TableHead className="text-right font-semibold">
                                    وضعیت
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        #{order.id.toLocaleString("fa-IR")}
                                    </TableCell>

                                    <TableCell>
                                        {(order.items ?? [])
                                            .reduce(
                                                (sum, item) =>
                                                    sum + item.quantity,
                                                0,
                                            )
                                            .toLocaleString("fa-IR")}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap font-medium">
                                        {formatAmount(order.total_amount)}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                        {formatDate(order.created_at)}
                                    </TableCell>

                                    <TableCell>
                                        <OrderStatus status={order.status} />
                                    </TableCell>
                                </TableRow>
                            ))}

                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-48 text-center"
                                    >
                                        <ClipboardList className="mx-auto mb-3 size-10 text-muted-foreground" />
                                        <p className="font-medium">
                                            سفارشی برای نمایش وجود ندارد.
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between gap-3 border-t p-4">
                        {currentPage > 1 ? (
                            <Link
                                href={`/dashboard/orders?page=${currentPage - 1}`}
                                className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
                            >
                                <ChevronRight className="size-4" />
                                صفحه قبل
                            </Link>
                        ) : (
                            <span />
                        )}

                        <span className="text-sm text-muted-foreground">
                            {currentPage.toLocaleString("fa-IR")} از{" "}
                            {totalPages.toLocaleString("fa-IR")}
                        </span>

                        {currentPage < totalPages ? (
                            <Link
                                href={`/dashboard/orders?page=${currentPage + 1}`}
                                className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
                            >
                                صفحه بعد
                                <ChevronLeft className="size-4" />
                            </Link>
                        ) : (
                            <span />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default async function OrdersPage({ searchParams }: Props) {
    const params = await searchParams;
    const requestedPage = Number(params.page ?? "1");

    const page =
        Number.isInteger(requestedPage) && requestedPage > 0
            ? requestedPage
            : 1;

    return (
        <Suspense fallback={<OrdersLoading />}>
            <OrdersContent page={page} />
        </Suspense>
    );
}
