
export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Overview
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Welcome to your dashboard.
                </p>
            </div>

            <div className="rounded-lg border bg-background p-6">
                <h2 className="text-lg font-semibold">
                    Dashboard
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Your dashboard overview will appear here.
                </p>
            </div>
        </div>
    );
}
