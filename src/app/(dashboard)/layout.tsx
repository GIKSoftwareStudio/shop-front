
import type { ReactNode } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-muted/30 md:flex-row">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar />

                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
