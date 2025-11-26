"use client";

import Link from "next/link";
import DashboardSidebar from "../../components/layout/DashboardSidebar";
import DashboardHeader from "../../components/layout/DashboardHeader";
import DashboardFooter from "../../components/layout/DashboardFooter";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function UnauthorizedPage() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

            {/* Contenido Principal */}
            <div className="flex flex-col flex-1">

                {/* Header */}
                <DashboardHeader />

                {/* Contenido */}
                <main className="flex flex-col items-center justify-center flex-1 text-center px-6">

                    <ShieldAlert size={80} className="text-red-600 mb-6" />

                    <h1 className="text-3xl font-bold mb-3 text-gray-800">
                        Acceso no autorizado
                    </h1>

                    <p className="text-gray-600 text-lg mb-6 max-w-xl">
                        No tienes permisos para acceder a esta sección. Si crees que esto es un error,
                        comunícate con el administrador del sistema.
                    </p>

                    <Link
                        href="/dashboard"
                        className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-md transition"
                    >
                        Volver al inicio
                    </Link>

                </main>

                <DashboardFooter />

            </div>
        </div>
    );
}
