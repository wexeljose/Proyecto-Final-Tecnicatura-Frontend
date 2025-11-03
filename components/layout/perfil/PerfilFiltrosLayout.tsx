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
  return (
    <div className="w-[250px] flex flex-col gap-4 p-4 border rounded shadow-sm bg-white">
      <h2 className="font-bold text-lg mb-2">Filtros</h2>

      {/* Filtro por nombre */}
      <input
        type="text"
        placeholder="Nombre"
        className="border p-2 rounded"
        value={filtroNombre}
        onChange={(e) => setFiltroNombre(e.target.value)}
      />

      {/* Filtro por estado */}
      <select
        className="border p-2 rounded"
        value={filtroEstado}
        onChange={(e) => setFiltroEstado(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="Activos">Activos</option>
        <option value="Inactivos">Inactivos</option>
        <option value="Sin_validar">Sin validar</option>
      </select>

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        onClick={aplicarFiltros}
      >
        Buscar
      </button>

      <hr className="my-2" />

      <button
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        onClick={onCrear}
      >
        Crear Perfil
      </button>
    </div>
  );
}
