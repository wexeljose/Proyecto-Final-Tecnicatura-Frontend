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
    FileSearch,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useSession } from "next-auth/react";

interface Props {
    collapsed: boolean;
    onToggle: () => void;
}

// ------------------------------------------------------
// 📌 ROLES QUE USA EL SISTEMA
// ------------------------------------------------------
type TipoUsuario = "AuxiliarAdm" | "Socio" | "NoSocio";

// ------------------------------------------------------
// 📌 Estructura de item del menú
// ------------------------------------------------------
interface MenuItem {
    href: string;
    icon: JSX.Element;
    label: string;
    tooltip: string;
    roles: TipoUsuario[];
}

// ------------------------------------------------------
// 📌 DEFINICIÓN DE MENÚ
// ------------------------------------------------------
const menuItems: MenuItem[] = [
    {
        href: "/dashboard",
        icon: <Home size={18} />,
        label: "Inicio",
        tooltip: "Panel principal",
        roles: ["AuxiliarAdm", "Socio", "NoSocio"],
    },
    {
        href: "/dashboard/usuarios",
        icon: <Users size={18} />,
        label: "Usuarios",
        tooltip: "Gestión de usuarios",
        roles: ["AuxiliarAdm"],
    },
    {
        href: "/dashboard/perfiles",
        icon: <Users size={18} />,
        label: "Perfiles",
        tooltip: "Gestión de perfiles",
        roles: ["AuxiliarAdm"],
    },
    {
        href: "/dashboard/funcionalidades",
        icon: <ShieldCheck size={18} />,
        label: "Funcionalidades",
        tooltip: "Gestión de funcionalidades",
        roles: ["AuxiliarAdm"],
    },
    {
        href: "/dashboard/actividades",
        icon: <CalendarDays size={18} />,
        label: "Actividades",
        tooltip: "Gestión de actividades",
        roles: ["AuxiliarAdm"],
    },
    {
        href: "/dashboard/inscripcion-actividades",
        icon: <CalendarDays size={18} />,
        label: "Inscripción a Actividades",
        tooltip: "Inscribirse a actividades",
        roles: ["AuxiliarAdm", "Socio", "NoSocio"],
    },
    {
        href: "/dashboard/tipo-actividad",
        icon: <CalendarDays size={18} />,
        label: "Tipos de Actividad",
        tooltip: "Gestión de tipos de actividad",
        roles: ["AuxiliarAdm"],
    },
    {
        href: "/dashboard/recursos",
        icon: <Building2 size={18} />,
        label: "Espacios",
        tooltip: "Gestión de espacios",
        roles: ["AuxiliarAdm"],
    },
    {
        href: "/dashboard/pagos",
        icon: <CreditCard size={18} />,
        label: "Pagos",
        tooltip: "Gestión de pagos",
        roles: ["AuxiliarAdm"],
    },
    {
        href: "/dashboard/reserva",
        icon: <ClipboardList size={18} />,
        label: "Reservas",
        tooltip: "Reservar actividades o espacios",
        roles: ["AuxiliarAdm", "Socio", "NoSocio"],
    },
    {
        href: "/dashboard/reportes",
        icon: <FileSearch size={18} />,
        label: "Reportes",
        tooltip: "Reportes del sistema",
        roles: ["AuxiliarAdm"],
    },

    {
        href: "/dashboard/auditorias",
        icon: <FileSearch size={18} />,
        label: "Auditorías",
        tooltip: "Revisión de auditorías",
        roles: ["AuxiliarAdm"],
    },
];

// ------------------------------------------------------
// 📌 COMPONENTE PRINCIPAL
// ------------------------------------------------------
export default function DashboardSidebar({ collapsed, onToggle }: Props) {
    const { data: session } = useSession();

    const tipoUsuario = session?.user?.tipoUsuario as TipoUsuario | undefined;

    const visibleItems = menuItems.filter((item) =>
        tipoUsuario ? item.roles.includes(tipoUsuario) : false
    );

    return (
        <motion.aside
            animate={{ width: collapsed ? "70px" : "230px" }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 h-full bg-blue-900 text-white shadow-md flex flex-col z-30"
        >
            <nav className="flex flex-col gap-1 mt-[90px] relative">
                <SidebarButton
                    onClick={onToggle}
                    icon={
                        collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />
                    }
                    label={collapsed ? "Mostrar menú" : "Ocultar menú"}
                    collapsed={collapsed}
                />

                {visibleItems.map((item) => (
                    <SidebarLink
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        tooltip={item.tooltip}
                        collapsed={collapsed}
                    />
                ))}
            </nav>
        </motion.aside>
    );
}

// ------------------------------------------------------
// 📌 Botón de colapsar
// ------------------------------------------------------
interface SidebarButtonProps {
    onClick: () => void;
    icon: JSX.Element;
    label: string;
    collapsed: boolean;
}

function SidebarButton({ onClick, icon, label, collapsed }: SidebarButtonProps) {
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

// ------------------------------------------------------
// 📌 Link de menú
// ------------------------------------------------------
interface SidebarLinkProps {
    href: string;
    icon: JSX.Element;
    label: string;
    tooltip: string;
    collapsed: boolean;
}

function SidebarLink({ href, icon, label, tooltip, collapsed }: SidebarLinkProps) {
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

// ------------------------------------------------------
// 📌 Tooltip
// ------------------------------------------------------
interface TooltipProps {
    text: string;
    enabled?: boolean;
    children: React.ReactNode;
}

function Tooltip({ text, enabled, children }: TooltipProps) {
    if (!enabled) return <>{children}</>;

    return (
        <div className="relative group flex">
            {children}
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-md pointer-events-none">
        {text}
      </span>
        </div>
    );
}


