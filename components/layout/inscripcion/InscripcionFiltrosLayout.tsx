// components/layout/inscripcion/InscripcionFiltrosLayout.tsx

"use client";

import { FiltrosInscripcion } from "../../../types/inscripcion";

interface Props {
  filtros: FiltrosInscripcion;
  setFiltros: (filtros: FiltrosInscripcion) => void;
  aplicarFiltros: () => void;
  limpiarFiltros: () => void;
}

export default function InscripcionFiltrosLayout({
  filtros,
  setFiltros,
  aplicarFiltros,
  limpiarFiltros,
}: Props) {
  const handleChange = (field: keyof FiltrosInscripcion, value: string) => {
    setFiltros({ ...filtros, [field]: value });
  };

  return (
    <div className="w-80 border border-gray-200 rounded bg-white p-4 shadow">
      <h2 className="text-sm font-medium text-gray-900 mb-4">Filtros de Búsqueda</h2>

      <div className="space-y-3">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={filtros.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Fecha Desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Desde
          </label>
          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => handleChange("fechaDesde", e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Hasta
          </label>
          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => handleChange("fechaHasta", e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Costo Mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Costo Mínimo
          </label>
          <input
            type="number"
            value={filtros.costoMin}
            onChange={(e) => handleChange("costoMin", e.target.value)}
            placeholder="0"
            min="0"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Costo Máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Costo Máximo
          </label>
          <input
            type="number"
            value={filtros.costoMax}
            onChange={(e) => handleChange("costoMax", e.target.value)}
            placeholder="999999"
            min="0"
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={filtros.estado}
            onChange={(e) => handleChange("estado", e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="disponible">Disponibles</option>
            <option value="inscrito">Mis Inscripciones</option>
            <option value="no_disponible">No Disponibles</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={aplicarFiltros}
            className="flex-1 inline-flex items-center justify-center px-2 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
          >
            Aplicar
          </button>
          <button
            onClick={limpiarFiltros}
            className="flex-1 inline-flex items-center justify-center px-2 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-colors duration-200"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}