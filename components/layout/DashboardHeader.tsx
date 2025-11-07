"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { User } from "lucide-react";

export default function DashboardHeader() {
    const { data: session } = useSession();
    const usuario = session?.user?.email || "Usuario";
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 flex justify-between items-center px-8 py-4 h-[75px] shadow-sm">
            {/* Logo + título */}
            <div className="flex items-center gap-3">
                <Image
                    src="/Logo_ASUR_sin_letras.png"
                    alt="Logo ASUR"
                    width={50}
                    height={50}
                />
                <h1 className="text-xl font-bold text-blue-900 whitespace-nowrap">
                    Asociación de Sordos del Uruguay
                </h1>
            </div>

            {/* Usuario */}
            <div className="relative flex items-center gap-2" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 text-blue-900 font-medium hover:text-blue-700 transition text-sm select-none"
                >
                    <User size={18} />
                    {usuario}
                </button>

                {/* Menú desplegable hacia abajo */}
                <div
                    className={`absolute right-0 top-[calc(100%+0.5rem)] w-44 bg-white border border-gray-200 rounded-md shadow-lg transition-all duration-200 ease-out z-50
                    ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}
                >
                    {/* Flecha arriba */}
                    <div className="absolute right-4 -top-2 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"></div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-900 rounded-md transition"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </header>
    );
}






