
import SalesChart from "@/components/dashboard/sales/SalesChart";

export default function DashboardPage() {
    return (
        <div dir="rtl" className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    نمای کلی
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    به پنل مدیریتی فروشگاه خوش آمدید.
                </p>
            </div>

            <SalesChart />
        </div>
    );
}
