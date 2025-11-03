"use client";
//import { useState } from "react";

interface Props {
  filtroNombre: string;
  setFiltroNombre: (value: string) => void;
  filtroEstado: string;
  setFiltroEstado: (value: string) => void;
  aplicarFiltros: () => void;
  onCrear: () => void; // abrir modal crear perfil
}

export default function FiltrosPerfil({
  filtroNombre,
  setFiltroNombre,
  filtroEstado,
  setFiltroEstado,
  aplicarFiltros,
  onCrear,
}: Props) {

    const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroEstado("");
    aplicarFiltros(); 
  };

  return (
    <div className="w-[240px] flex flex-col gap-2 p-3 border border-gray-200 rounded bg-white shadow">
      <h2 className="font-medium text-sm text-gray-900 pb-2 border-b border-gray-200">Filtros</h2>

      {/* Filtro por nombre */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500">Nombre del perfil</label>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="w-full border border-gray-200 px-2 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
      </div>

      {/* Filtro por estado */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-500">Estado</label>
        <select
          className="w-full border border-gray-200 px-2 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Activos">Activos</option>
          <option value="Inactivos">Inactivos</option>
          <option value="Sin_validar">Sin validar</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-200 mt-1">
        <button
          onClick={aplicarFiltros}
          className="inline-flex items-center justify-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Buscar</span>
        </button>

        <button
          onClick={limpiarFiltros}
          className="inline-flex items-center justify-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Limpiar</span>
        </button>

        <button
          onClick={onCrear}
          className="inline-flex items-center justify-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 text-sm font-medium rounded hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Crear perfil</span>
        </button>
      </div>
    </div>
  );
}
