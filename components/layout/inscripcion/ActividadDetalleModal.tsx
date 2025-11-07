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
    if (!actividad.requiereInscripcion) return false;
    if (!actividad.fechaAperturaInscripcion) return false;
    if (!actividad.fechaAct) return false;

    // Verificar fechas
    if (new Date(actividad.fechaAct) < new Date()) return false;
    if (new Date(actividad.fechaAperturaInscripcion) > new Date()) return false;

    const hoy = new Date().toISOString().split("T")[0];
    const fechaApertura = actividad.fechaAperturaInscripcion;
    
    return fechaApertura <= hoy;
  };

  const puedeCancelar = () => {
    if (!actividad.inscrito) return false;
    
    const hoy = new Date().toISOString().split("T")[0];
    const fechaActividad = actividad.fechaAct;
    
    return fechaActividad >= hoy;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow border border-gray-200 w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900">
            Detalle de Actividad
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

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto flex-1 px-4 py-3">
          <div className="space-y-3">
            {/* Estado de Inscripción */}
            {actividad.inscrito && (
              <div className="bg-green-50 border border-green-200 rounded px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-green-100 text-green-800">
                    ✓ Inscrito
                  </span>
                  {actividad.fechaInscripcion && (
                    <span className="text-sm text-gray-500">
                      {formatearFecha(actividad.fechaInscripcion)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">
                Nombre
              </label>
              <p className="text-sm text-gray-900">{actividad.nombre}</p>
            </div>

            {/* Fecha, Hora y Costo en una fila */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Fecha
                </label>
                <p className="text-sm text-gray-900">
                  {formatearFecha(actividad.fechaAct)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Hora
                </label>
                <p className="text-sm text-gray-900">
                  {formatearHora(actividad.horaAct)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Costo
                </label>
                <p className="text-sm text-gray-900 font-medium">
                  ${actividad.costoTicket}
                </p>
              </div>
            </div>

            {/* Duración y Forma de Pago */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Duración
                </label>
                <p className="text-sm text-gray-900">
                  {formatearHora(actividad.duracion)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Forma de Pago
                </label>
                <p className="text-sm text-gray-900">{actividad.formaPago || "-"}</p>
              </div>
            </div>

            {/* Descripción */}
            {actividad.descripcion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Descripción
                </label>
                <p className="text-sm text-gray-500 whitespace-pre-wrap">
                  {actividad.descripcion}
                </p>
              </div>
            )}

            {/* Objetivo */}
            {actividad.objetivo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Objetivo
                </label>
                <p className="text-sm text-gray-500 whitespace-pre-wrap">
                  {actividad.objetivo}
                </p>
              </div>
            )}

            {/* Apertura Inscripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">
                Apertura de Inscripción
              </label>
              <p className="text-sm text-gray-900">
                {formatearFecha(actividad.fechaAperturaInscripcion)}
              </p>
            </div>

            {/* Observaciones */}
            {actividad.observaciones && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  Observaciones
                </label>
                <p className="text-sm text-gray-500 whitespace-pre-wrap">
                  {actividad.observaciones}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer con botones */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-colors duration-200"
          >
            Cerrar
          </button>

          {puedeInscribirse() && onInscribir && (
            <button
              onClick={() => {
                onInscribir();
                onClose();
              }}
              className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-sm font-medium rounded hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200"
            >
              Inscribirse
            </button>
          )}

          {puedeCancelar() && onCancelar && (
            <button
              onClick={() => {
                onCancelar();
                onClose();
              }}
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