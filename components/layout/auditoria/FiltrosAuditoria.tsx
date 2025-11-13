"use client";

import type { FiltrosAuditoria } from "../../../types/auditoria";

interface Props {
    filtros: FiltrosAuditoria;
    setFiltros: (f: FiltrosAuditoria) => void;
    onBuscar: () => void;
}

export default function FiltrosAuditoria({ filtros, setFiltros, onBuscar }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFiltros({ ...filtros, [name]: value });
    };

    const limpiar = () =>
        setFiltros({
            nombreUsuario: "",
            operacion: "",
            seccion: "",
            fechaDesde: "",
            fechaHasta: "",
            terminal: "",

        });

    return (
        <div className="w-[240px] flex flex-col gap-2 p-3 border border-gray-200 rounded bg-white shadow">
            <h2 className="font-medium text-sm text-gray-900 pb-2 border-b border-gray-200">Filtros</h2>

            <input
                type="text"
                name="nombreUsuario"
                placeholder="Usuario"
                value={filtros.nombreUsuario}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            />

            <input
                type="text"
                name="operacion"
                placeholder="Operación"
                value={filtros.operacion}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            />

            <input
                type="text"
                name="seccion"
                placeholder="Sección"
                value={filtros.seccion}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            />

            <input
                type="text"
                name="terminal"
                placeholder="Terminal/IP"
                value={filtros.terminal}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            />

            <input
                type="text"
                name="fechaDesde"
                placeholder="Fecha desde (YYYY-MM-DD)"
                value={filtros.fechaDesde}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            />

            <input
                type="text"
                name="fechaHasta"
                placeholder="Fecha hasta (YYYY-MM-DD)"
                value={filtros.fechaHasta}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            />

            <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-200 mt-1">

                {/* Botón Buscar */}
                <button
                    onClick={onBuscar}
                    className="inline-flex items-center justify-center px-2 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                >
                    Buscar
                </button>

                {/* Botón Limpiar */}
                <button
                    onClick={() => {
                        limpiar();
                    }}
                    className="inline-flex items-center justify-center px-2 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100"
                >
                    Limpiar
                </button>
            </div>
        </div>
    );
}
