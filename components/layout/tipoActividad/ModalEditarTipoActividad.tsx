"use client";

import { useState } from "react";
import { modificarDescripcionTipoDeActividad } from "../../../app/services/tipoDeActividad";
import toast from "react-hot-toast";
import { TipoActividad } from "../../../types/tipoDeActividad";
import { confirmarAccion } from "../../../.idea/utils/confirmarAccion";

interface Props {
  tipo: TipoActividad;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function ModalEditarTipoActividad({ tipo, onClose, onUpdated }: Props) {
  const [descripcion, setDescripcion] = useState(tipo.descripcion);
  const [saving, setSaving] = useState(false);

  const handleGuardar = async () => {
    if (!descripcion.trim()) {
      toast.error("La descripción no puede estar vacía ⚠️");
      return;
    }

    const confirmado = await confirmarAccion(
      `¿Confirmas modificar la descripción de "${tipo.nombre}"?`
    );
    if (!confirmado) return;

    try {
      setSaving(true);
      await toast.promise(
        modificarDescripcionTipoDeActividad(tipo.id, descripcion),
        {
          loading: "Guardando cambios...",
          success: "Tipo de actividad actualizado ✅",
          error: "Error al actualizar ❌",
        }
      );
      
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow border border-gray-200 w-full max-w-md">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">
            Editar Tipo de Actividad
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Cerrar"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-3">
          {/* Nombre (no editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={tipo.nombre}
              disabled
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              El nombre no se puede modificar
            </p>
          </div>

          {/* Descripción (editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={4}
              placeholder="Ingresa la descripción del tipo de actividad"
            />
          </div>

          {/* Estado actual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado actual
            </label>
            <div>
              {tipo.estado === "Activos" ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-green-100 text-green-800">
                  Activo
                </span>
              ) : tipo.estado === "Inactivos" ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-red-100 text-red-800">
                  Inactivo
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
                  Sin validar
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={saving || !descripcion.trim()}
            className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}