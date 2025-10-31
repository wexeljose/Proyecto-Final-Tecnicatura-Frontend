"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Users, CalendarDays, CreditCard, ClipboardList } from "lucide-react";
import { useSession, getSession } from "next-auth/react"; // 👈 Importamos también getSession

interface DashboardData {
    sociosActivos: number;
    actividadesAbiertas: number;
    reservasHoy: number;
    pagosPendientes: number;
}

interface DashboardCardProps {
    icon: JSX.Element;
    title: string;
    value: number;
}

export default function DashboardPage() {
    const [datos, setDatos] = useState<DashboardData>({
        sociosActivos: 0,
        actividadesAbiertas: 0,
        reservasHoy: 0,
        pagosPendientes: 0,
    });

    const { data: session } = useSession(); // 👈 Obtenemos la sesión de NextAuth
    const usuario = session?.user?.name || "Usuario"; // 👈 Si no hay sesión, muestra “Usuario”

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // 👇 Obtenemos el token directamente de la sesión
                const sesionActual = await getSession();
                const token = sesionActual?.accessToken;

                if (!token) {
                    console.warn("No se encontró token en la sesión");
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (res.ok) {
                    const data: DashboardData = await res.json();
                    setDatos(data);
                } else {
                    console.error("Error al cargar datos del dashboard:", res.statusText);
                }
            } catch (error) {
                console.error("Error cargando dashboard:", error);
            }
        };

        fetchDashboard();
    }, []); // 👈 Llama una sola vez al cargar

    return (
        <main className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            {/* Header */}
            <header className="bg-white shadow-md py-4 flex justify-between items-center px-8">
                <div className="flex items-center gap-4">
                    <Image src="/asur-logo.png" alt="ASUR" width={60} height={60} />
                    <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-wide">
                        Asociación de Sordos del Uruguay
                    </h1>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                    <Image src="/user-icon.svg" alt="Usuario" width={30} height={30} />
                </div>
            </header>

            {/* Contenido principal */}
            <section className="flex-grow flex flex-col items-center justify-center p-10">
                <h2 className="text-lg font-medium mb-2 text-gray-700">
                    Bienvenido/a, <span className="font-semibold">{usuario}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    <DashboardCard
                        icon={<Users className="text-blue-800" size={30} />}
                        title="Socios Activos"
                        value={datos.sociosActivos}
                    />
                    <DashboardCard
                        icon={<ClipboardList className="text-blue-800" size={30} />}
                        title="Actividades Abiertas"
                        value={datos.actividadesAbiertas}
                    />
                    <DashboardCard
                        icon={<CalendarDays className="text-blue-800" size={30} />}
                        title="Reservas para Hoy"
                        value={datos.reservasHoy}
                    />
                    <DashboardCard
                        icon={<CreditCard className="text-blue-800" size={30} />}
                        title="Pagos Pendientes"
                        value={datos.pagosPendientes}
                    />
                </div>

                {/* Botones */}
                <div className="flex gap-4 mt-10">
                    <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
                        Nueva Actividad
                    </button>
                    <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
                        Registrar Espacio
                    </button>
                    <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
                        Registrar Pago
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full bg-blue-900 text-white py-3 shadow-inner text-center text-sm">
                © {new Date().getFullYear()} Asociación de Sordos del Uruguay — Desarrollado por MAVATECH.
            </footer>
        </main>
    );
}

function DashboardCard({ icon, title, value }: DashboardCardProps) {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center border border-gray-100 hover:shadow-lg transition">
            {icon}
            <p className="text-3xl font-bold mt-2 text-blue-900">{value}</p>
            <p className="text-sm text-gray-600 mt-1">{title}</p>
        </div>
    );
}
