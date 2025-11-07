// components/layout/inscripcion/ActividadDetalleModal.tsx

"use client";

import { ActividadConInscripcion } from "../../../types/inscripcion";

interface Props {
  actividad: ActividadConInscripcion;
  onClose: () => void;
  onInscribir?: () => void;
  onCancelar?: () => void;
}

export default function ActividadDetalleModal({
  actividad,
  onClose,
  onInscribir,
  onCancelar,
}: Props) {
  const formatearFecha = (fecha: string) => {
    if (!fecha) return "-";
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatearHora = (hora: string) => {
    if (!hora) return "-";
    return hora.substring(0, 5); // HH:mm
  };

  const puedeInscribirse = () => {
    if (actividad.inscrito) return false;
    if (actividad.estado !== "Activos") return false;
    
    const hoy = new Date().toISOString().split("T")[0];
    const fechaApertura = actividad.fechaAperturaInscripcion;
    
    return fechaApertura <= hoy;
  };

  const puedeCancelar = () => {
    if (!actividad.inscrito) return false;
    
    const hoy = new Date().toISOString().split("T")[0];
    const fechaActividad = actividad.fechaAct;
    
    return fechaActividad > hoy;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">
            Detalle de Actividad
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="h-5 w-5"
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
        <div className="p-4 space-y-4">
          {/* Estado de Inscripción */}
          {actividad.inscrito && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-green-100 text-green-800">
                  ✓ Ya estás inscrito
                </span>
                {actividad.fechaInscripcion && (
                  <span className="text-sm text-gray-600">
                    Fecha de inscripción: {formatearFecha(actividad.fechaInscripcion)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Información General */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <p className="text-sm text-gray-900">{actividad.nombre}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {actividad.descripcion || "Sin descripción"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivo
              </label>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {actividad.objetivo || "Sin objetivo definido"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <p className="text-sm text-gray-900">
                  {formatearFecha(actividad.fechaAct)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <p className="text-sm text-gray-900">
                  {formatearHora(actividad.horaAct)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración
                </label>
                <p className="text-sm text-gray-900">
                  {formatearHora(actividad.duracion)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo
                </label>
                <p className="text-sm text-gray-900 font-medium">
                  ${actividad.costoTicket}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Forma de Pago
              </label>
              <p className="text-sm text-gray-900">{actividad.formaPago || "-"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Apertura de Inscripción
              </label>
              <p className="text-sm text-gray-900">
                {formatearFecha(actividad.fechaAperturaInscripcion)}
              </p>
            </div>

            {actividad.observaciones && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {actividad.observaciones}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer con botones */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-colors duration-200"
          >
            Cerrar
          </button>

          {puedeInscribirse() && onInscribir && (
            <button
              onClick={onInscribir}
              className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-sm font-medium rounded hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200"
            >
              Inscribirse
            </button>
          )}

          {puedeCancelar() && onCancelar && (
            <button
              onClick={onCancelar}
              className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-sm font-medium rounded hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200"
            >
              Cancelar Inscripción
            </button>
          )}
        </div>
      </div>
    </div>
  );
}