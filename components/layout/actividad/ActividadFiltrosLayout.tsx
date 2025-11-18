"use client";

import React, { useEffect } from "react";
import { toast } from "react-hot-toast";

interface Props {
  filtroNombre: string;
  setFiltroNombre: (value: string) => void;

  filtroEstado: string;
  setFiltroEstado: (value: string) => void;

  filtroFechaInicio: string;
  setFiltroFechaInicio: (value: string) => void;

  filtroFechaFin: string;
  setFiltroFechaFin: (value: string) => void;

  aplicarFiltros: () => void;
  limpiarFiltros: () => void;
  onCrear: () => void;
}

const ActividadFiltrosLayout: React.FC<Props> = ({
  filtroNombre,
  setFiltroNombre,
  filtroEstado,
  setFiltroEstado,
  filtroFechaInicio,
  setFiltroFechaInicio,
  filtroFechaFin,
  setFiltroFechaFin,
  aplicarFiltros,
  limpiarFiltros,
  onCrear,
}) => {

  const validarYAplicar = () => {
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

    // Validación nombre
    if (filtroNombre.trim()) {
      if (!nombreRegex.test(filtroNombre)) {
        toast.error("El nombre solo puede contener letras y espacios ❌");
        return;
      }

      if (filtroNombre.length > 50) {
        toast.error("El nombre no puede superar los 50 caracteres ❌");
        return;
      }
    }

    // Validación fecha
    if (filtroFechaInicio && filtroFechaFin) {
      if (new Date(filtroFechaInicio) > new Date(filtroFechaFin)) {
        toast.error("La fecha de inicio no puede ser mayor que la fecha fin ❌");
        return;
      }
    }

    aplicarFiltros();
  };

  // Autoaplicar filtros
  useEffect(() => {
    validarYAplicar();
  }, [filtroNombre, filtroEstado, filtroFechaInicio, filtroFechaFin]);

  return (
    <div className="w-72 p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>

      {/* Filtro nombre */}
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

      {/* Filtro estado */}
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

      {/* Fecha Inicio */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
        <input
          type="date"
          className="border p-2 w-full rounded"
          value={filtroFechaInicio}
          onChange={(e) => setFiltroFechaInicio(e.target.value)}
        />
      </div>

      {/* Fecha Fin */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Fecha Fin</label>
        <input
          type="date"
          className="border p-2 w-full rounded"
          value={filtroFechaFin}
          onChange={(e) => setFiltroFechaFin(e.target.value)}
        />
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={validarYAplicar}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Aplicar filtros
        </button>

        <button
          onClick={limpiarFiltros}
          className="bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
        >
          Limpiar filtros
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
