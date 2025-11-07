"use client";
import React from "react";

type EstadoFiltro = "" | "Activos" | "Inactivos" | "Sin_validar";

export default function RecursoFiltros({
                                           filtroNombre, setFiltroNombre,
                                           filtroEstado, setFiltroEstado,
                                           filtroCapMin, setFiltroCapMin,
                                           aplicar, onCrear,
                                       }: {
    filtroNombre: string;
    setFiltroNombre: (v: string) => void;

    filtroEstado: EstadoFiltro;
    setFiltroEstado: React.Dispatch<React.SetStateAction<EstadoFiltro>>;

    filtroCapMin: string;
    setFiltroCapMin: (v: string) => void;

    aplicar: () => void;
    onCrear: () => void;
}) {
    const limpiar = () => {
        setFiltroNombre("");
        setFiltroEstado("");
        setFiltroCapMin("");
        aplicar();
    };

    return (
        <aside className="w-[260px] p-3 border rounded bg-white">
            <h2 className="font-medium text-sm pb-2 border-b">Filtros</h2>

            <div className="space-y-2 mt-2">
                <input
                    className="w-full border px-2 py-1.5 rounded"
                    placeholder="Nombre contiene…"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />

                <select
                    className="w-full border px-2 py-1.5 rounded bg-white"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value as EstadoFiltro)}
                >
                    <option value="">Todos</option>
                    <option value="Activos">Activos</option>
                    <option value="Inactivos">Inactivos</option>
                    <option value="Sin_validar">Sin validar</option>
                </select>

                <input
                    className="w-full border px-2 py-1.5 rounded"
                    placeholder="Capacidad mínima"
                    type="number"
                    min={1}
                    value={filtroCapMin}
                    onChange={(e) => setFiltroCapMin(e.target.value)}
                />
            </div>

            <div className="flex gap-2 mt-3">
                <button onClick={aplicar} className="px-3 py-1 bg-blue-600 text-white rounded">Buscar</button>
                <button onClick={limpiar} className="px-3 py-1 border rounded">Limpiar</button>
            </div>

            <div className="mt-3">
                <button onClick={onCrear} className="px-3 py-1 bg-green-600 text-white rounded w-full">Nuevo recurso</button>
            </div>
        </aside>
    );
}