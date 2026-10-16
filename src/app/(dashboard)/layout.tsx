import { Suspense } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <SidebarProvider>
                <AppSidebar />
                <main>
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </Suspense>
    );
}