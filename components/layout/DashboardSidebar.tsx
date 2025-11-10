"use client";

import { motion } from "framer-motion";
import {
    PanelLeftOpen,
    PanelLeftClose,
    Home,
    Users,
    CalendarDays,
    CreditCard,
    Building2,
    ClipboardList,
    MapPin,
    FileSearch,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

interface Props {
    collapsed: boolean;
    onToggle: () => void;
}

export default function DashboardSidebar({ collapsed, onToggle }: Props) {
    return (
        <motion.aside
            animate={{ width: collapsed ? "70px" : "230px" }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 h-full bg-blue-900 text-white shadow-md flex flex-col z-30"
        >
            <nav className="flex flex-col gap-1 mt-[90px] relative">
                {/* Botón igual que los otros */}
                <SidebarButton
                    onClick={onToggle}
                    icon={collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    label={collapsed ? "Mostrar menú" : "Ocultar menú"}
                    collapsed={collapsed}
                />

                {/* Menú principal */}
                <SidebarLink
                    href="/dashboard"
                    icon={<Home size={18} />}
                    label="Inicio"
                    tooltip="Ir al panel principal"
                    collapsed={collapsed}
                />
                <SidebarLink
                    href="/dashboard/usuarios"
                    icon={<Users size={18} />}
                    label="Usuarios"
                    tooltip="Gestión de usuarios del sistema"
                    collapsed={collapsed}
                />

                <SidebarLink
                    href="/dashboard/perfiles"
                    icon={<Users size={18} />}
                    label="Perfiles"
                    tooltip="Gestión de perfiles y roles"
                    collapsed={collapsed}
                />

                <SidebarLink
                    href="/dashboard/funcionalidades"
                    icon={<ShieldCheck size={18} />}    // ← ícono para permisos/funciones
                    label="Funcionalidades"
                    tooltip="Gestión de funcionalidades y accesos"
                    collapsed={collapsed}
                />

                <SidebarLink
                    href="/dashboard/actividades"
                    icon={<CalendarDays size={18} />}
                    label="Actividades"
                    tooltip="Ver y registrar actividades"
                    collapsed={collapsed}
                />

                <SidebarLink
                    href="/dashboard/inscripcion-actividades"
                    icon={<CalendarDays size={18} />}
                    label="Inscripción a Actividades"
                    tooltip="Gestionar inscripciones a actividades"
                    collapsed={collapsed}
                />

                <SidebarLink
                    href="/dashboard/tipo-actividad"
                    icon={<CalendarDays size={18} />}
                    label="Tipos de Actividad"
                    tooltip="Gestión de tipos de actividad"
                    collapsed={collapsed}
                />

                <SidebarLink
                    href="/dashboard/recursos"
                    icon={<Building2 size={18} />}
                    label="Espacios"
                    tooltip="Administrar espacios y salas"
                    collapsed={collapsed}
                />
                <SidebarLink
                    href="/dashboard/pagos"
                    icon={<CreditCard size={18} />}
                    label="Pagos"
                    tooltip="Control de pagos registrados"
                    collapsed={collapsed}
                />
                <SidebarLink
                    href="/components/layout/reserva"
                    icon={<ClipboardList size={18} />}
                    label="Reservas"
                    tooltip="Gestión de reservas de actividades"
                    collapsed={collapsed}
                />
                <SidebarLink
                    href="/dashboard/ubicaciones"
                    icon={<MapPin size={18} />}
                    label="Ubicaciones"
                    tooltip="Gestión de lugares físicos"
                    collapsed={collapsed}
                />
                <SidebarLink
                    href="/dashboard/auditorias"
                    icon={<FileSearch size={18} />}
                    label="Auditorías"
                    tooltip="Registro y consulta de auditorías del sistema"
                    collapsed={collapsed}
                />
            </nav>
        </motion.aside>
    );
}

function SidebarButton({
                           onClick,
                           icon,
                           label,
                           collapsed,
                       }: {
    onClick: () => void;
    icon: JSX.Element;
    label: string;
    collapsed: boolean;
}) {
    return (
        <Tooltip text={label} enabled={collapsed}>
            <button
                onClick={onClick}
                className={clsx(
                    "flex items-center gap-3 px-4 py-2 text-sm hover:bg-blue-800 transition rounded-md mx-2 text-white w-[calc(100%-1rem)]",
                    collapsed && "justify-center"
                )}
            >
                {icon}
                {!collapsed && <span>{label}</span>}
            </button>
        </Tooltip>
    );
}

function SidebarLink({
                         href,
                         icon,
                         label,
                         tooltip,
                         collapsed,
                     }: {
    href: string;
    icon: JSX.Element;
    label: string;
    tooltip: string;
    collapsed: boolean;
}) {
    return (
        <Tooltip text={tooltip} enabled={collapsed}>
            <Link
                href={href}
                className={clsx(
                    "flex items-center gap-3 px-4 py-2 text-sm hover:bg-blue-800 transition rounded-md mx-2 text-white w-[calc(100%-1rem)]",
                    collapsed && "justify-center"
                )}
            >
                {icon}
                {!collapsed && <span>{label}</span>}
            </Link>
        </Tooltip>
    );
}

/* Tooltip que solo aparece si enabled = true */
function Tooltip({
                     text,
                     enabled,
                     children,
                 }: {
    text: string;
    enabled?: boolean;
    children: React.ReactNode;
}) {
    if (!enabled) return <>{children}</>; // No muestra tooltip si está expandido

    return (
        <div className="relative group flex">
            {children}
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-md pointer-events-none">
        {text}
      </span>
        </div>
    );
}


