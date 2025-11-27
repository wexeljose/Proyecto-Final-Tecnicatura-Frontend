"use client";

import { ReactNode, useState } from "react";
import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardFooter from "../../components/layout/DashboardFooter";
import DashboardSidebar from "../../components/layout/DashboardSidebar";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="relative flex min-h-screen bg-gray-50 text-gray-900">

            {/* Toaster global con configuración correcta */}
            <Toaster
                position="top-center"
                containerStyle={{
                    overflow: "visible",
                    zIndex: 999999,
                }}
                toastOptions={{
                    style: {
                        zIndex: 999999,
                    },
                }}
            />

            {/* Sidebar */}
            <div className="absolute top-0 left-0 bottom-0 z-20">
                <DashboardSidebar
                    collapsed={collapsed}
                    onToggle={() => setCollapsed(!collapsed)}
                />
            </div>

            {/* Header */}
            <DashboardHeader />

            {/* Contenido */}
            <div
                className={`relative flex flex-col flex-1 min-h-screen transition-all duration-300 ${
                    collapsed ? "ml-[70px]" : "ml-[230px]"
                } pt-[120px] pb-[90px] z-10 overflow-visible`}
            >
                <main className="flex-1 px-8 overflow-visible">
                    {children}
                </main>
            </div>

            {/* Footer */}
            <DashboardFooter />
        </div>
    );
}
