"use client";

import React from "react";

interface Props {
  filtroNombre: string;
  setFiltroNombre: (value: string) => void;
  filtroEstado: string;
  setFiltroEstado: (value: string) => void;
  aplicarFiltros: () => void;
  onCrear: () => void;
}

const ActividadFiltrosLayout: React.FC<Props> = ({
  filtroNombre,
  setFiltroNombre,
  filtroEstado,
  setFiltroEstado,
  aplicarFiltros,
  onCrear,
}) => {
  return (
    <div className="w-72 p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>

      {/* Filtro por nombre */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          placeholder="Buscar por nombre"
        />
      </div>

      {/* Filtro por estado */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Estado</label>
        <select
          className="border p-2 w-full rounded"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivos">Inactivos</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={aplicarFiltros}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={onCrear}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          + Nueva Actividad
        </button>
      </div>
    </div>
  );
};

export default ActividadFiltrosLayout;

