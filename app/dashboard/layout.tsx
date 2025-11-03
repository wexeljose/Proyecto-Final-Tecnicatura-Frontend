"use client";


import { ReactNode, useState } from "react";
import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardFooter from "../../components/layout/DashboardFooter"; 
import DashboardSidebar from "../../components/layout/DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="relative flex min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
            {/* Sidebar debajo del header */}
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
                } pt-[90px] pb-[70px] z-10`}
            >
                <main className="flex-1 px-8">{children}</main>
            </div>

            {/* Footer fijo */}
            <DashboardFooter />
        </div>
    );
}
