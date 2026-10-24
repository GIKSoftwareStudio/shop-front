
import { Suspense } from "react";

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <SidebarProvider>
                <AppSidebar />

                <SidebarInset className="min-w-0">
                    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
                        <SidebarTrigger
                            className="shrink-0"
                            aria-label="باز و بسته کردن منو"
                        />

                        <div className="min-w-0 flex-1">
                            <Topbar />
                        </div>
                    </header>

                    <main
                        dir="rtl"
                        className="min-w-0 flex-1 p-4 md:p-6 lg:p-8"
                    >
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </Suspense>
    );
}
