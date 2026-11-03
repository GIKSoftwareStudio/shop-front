"use client";

import { useEffect, useState, useMemo } from "react";
import { getAdminOrders, type AdminOrder } from "@/api/admin/orders";
import { TrendingUp, Calendar, ShoppingBag, DollarSign } from "lucide-react";

type TimeRange = "today" | "week" | "month" | "three_months" | "all";

export default function SalesChart() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [range, setRange] = useState<TimeRange>("week");

    useEffect(() => {
        async function fetchOrdersData() {
            try {
                setLoading(true);
                // Fetch up to multiple pages or page 1 if comprehensive
                const response = await getAdminOrders(1);
                setOrders(response?.data ?? []);
            } catch (err: any) {
                setError(err?.message || "خطا در دریافت اطلاعات فروش");
            } finally {
                setLoading(false);
            }
        }

        fetchOrdersData();
    }, []);

    const filteredData = useMemo(() => {
        const now = new Date();
        const paidOrders = orders.filter((o) => o.status === "paid");

        return paidOrders.filter((order) => {
            const orderDate = new Date(order.created_at);
            if (Number.isNaN(orderDate.getTime())) return false;

            const diffTime = now.getTime() - orderDate.getTime();
            const diffDays = diffTime / (1000 * 3600 * 24);

            if (range === "today") {
                return orderDate.toDateString() === now.toDateString();
            }
            if (range === "week") {
                return diffDays <= 7;
            }
            if (range === "month") {
                return diffDays <= 30;
            }
            if (range === "three_months") {
                return diffDays <= 90;
            }
            return true; // "all"
        });
    }, [orders, range]);

    const { chartPoints, totalSales, totalCount } = useMemo(() => {
        const aggregated: Record<string, { sales: number; count: number }> = {};

        let sumSales = 0;
        let sumCount = 0;

        filteredData.forEach((order) => {
            const dateStr = new Date(order.created_at).toLocaleDateString("fa-IR", {
                month: "short",
                day: "numeric",
            });
            const amount = Number(order.total_amount) || 0;

            sumSales += amount;
            sumCount += 1;

            if (!aggregated[dateStr]) {
                aggregated[dateStr] = { sales: 0, count: 0 };
            }

            aggregated[dateStr].sales += amount;
            aggregated[dateStr].count += 1;
        });

        const points = Object.entries(aggregated).map(([date, data]) => ({
            date,
            sales: data.sales,
            count: data.count,
        }));

        return {
            chartPoints: points,
            totalSales: sumSales,
            totalCount: sumCount,
        };
    }, [filteredData]);

    if (loading) {
        return (
            <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500 animate-pulse">
                    <div className="size-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                    در حال پردازش داده‌های فروش...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-80 items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm dark:border-red-900/50 dark:bg-red-950/40">
                {error}
            </div>
        );
    }

    const maxSales = Math.max(...chartPoints.map((p) => p.sales), 1);

    return (
        <div dir="rtl" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">فروش کل دوره</span>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                            <DollarSign className="size-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {totalSales.toLocaleString("fa-IR")}
                        </span>
                        <span className="text-xs font-medium text-slate-500">تومان</span>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">تعداد سفارش‌های موفق</span>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <ShoppingBag className="size-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {totalCount.toLocaleString("fa-IR")}
                        </span>
                        <span className="text-xs font-medium text-slate-500">سفارش</span>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">میانگین ارزش سفارش</span>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                            <TrendingUp className="size-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {totalCount > 0 ? Math.round(totalSales / totalCount).toLocaleString("fa-IR") : "۰"}
                        </span>
                        <span className="text-xs font-medium text-slate-500">تومان</span>
                    </div>
                </div>
            </div>

            {/* Chart Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">تحلیل روند فروش</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">نمایش گرافیکی درآمد و تراکنش‌های موفق</p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
                        <button
                            type="button"
                            onClick={() => setRange("today")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                range === "today"
                                    ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            }`}
                        >
                            امروز
                        </button>
                        <button
                            type="button"
                            onClick={() => setRange("week")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                range === "week"
                                    ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            }`}
                        >
                            یک هفته
                        </button>
                        <button
                            type="button"
                            onClick={() => setRange("month")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                range === "month"
                                    ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            }`}
                        >
                            یک ماه
                        </button>
                        <button
                            type="button"
                            onClick={() => setRange("three_months")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                range === "three_months"
                                    ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            }`}
                        >
                            سه ماه
                        </button>
                        <button
                            type="button"
                            onClick={() => setRange("all")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                range === "all"
                                    ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            }`}
                        >
                            کل
                        </button>
                    </div>
                </div>

                {chartPoints.length === 0 ? (
                    <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-muted-foreground dark:border-slate-800">
                        <Calendar className="mb-2 size-10 text-slate-400 opacity-50" />
                        <p>داده‌ای برای بازه زمانی انتخاب‌شده یافت نشد.</p>
                    </div>
                ) : (
                    <div className="flex h-72 items-end gap-3 overflow-x-auto pt-8 pb-2">
                        {chartPoints.map((point, index) => {
                            const heightPercentage = Math.max(
                                Math.round((point.sales / maxSales) * 100),
                                12
                            );

                            return (
                                <div
                                    key={index}
                                    className="group relative flex flex-1 flex-col items-center gap-2 min-w-[50px] h-full justify-end"
                                >
                                    {/* Tooltip */}
                                    <div className="absolute -top-14 z-20 hidden rounded-xl bg-slate-900 px-3 py-2 text-[11px] text-white shadow-xl group-hover:flex flex-col items-center whitespace-nowrap dark:bg-slate-800">
                                        <span className="font-bold">{point.sales.toLocaleString("fa-IR")} تومان</span>
                                        <span className="text-[10px] text-slate-300">{point.count} سفارش موفق</span>
                                    </div>

                                    <div className="flex h-56 w-full items-end justify-center rounded-t-xl bg-slate-50 p-1.5 dark:bg-slate-800/50">
                                        <div
                                            style={{ height: `${heightPercentage}%` }}
                                            className="w-full rounded-lg bg-gradient-to-t from-blue-600 via-indigo-600 to-blue-500 shadow-sm transition-all duration-500 hover:brightness-110 group-hover:scale-105"
                                        />
                                    </div>

                                    <span className="text-[11px] font-semibold text-slate-600 truncate w-full text-center dark:text-slate-400">
                                        {point.date}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
