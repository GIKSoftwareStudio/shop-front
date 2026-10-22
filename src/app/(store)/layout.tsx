
import type { ReactNode } from "react";

import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import ChatWidget from "@/components/store/ChatWidget";

export default function StoreLayout({
                                        children,
                                    }: {
    children: ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
                {children}
            </main>

            <Footer />

            <ChatWidget />
        </div>
    );
}
