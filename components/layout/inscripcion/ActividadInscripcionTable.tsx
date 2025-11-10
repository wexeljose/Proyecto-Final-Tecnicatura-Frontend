// components/layout/inscripcion/ActividadInscripcionTable.tsx

"use client";

import { ActividadConInscripcion } from "../../../types/inscripcion";

interface Props {
  actividades: ActividadConInscripcion[];
  onVerDetalle: (actividad: ActividadConInscripcion) => void;
  onInscribir: (actividad: ActividadConInscripcion) => void;
  onCancelar: (actividad: ActividadConInscripcion) => void;
}

export default function ActividadInscripcionTable({
  actividades,
  onVerDetalle,
  onInscribir,
  onCancelar,
}: Props) {
  if (!actividades.length) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No hay actividades disponibles para inscripción.
      </div>
    );
  }

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "-";
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatearHora = (hora: string) => {
    if (!hora) return "-";
    return hora.substring(0, 5); // HH:mm
  };

  const puedeInscribirse = (actividad: ActividadConInscripcion) => {
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

  const puedeCancelar = (actividad: ActividadConInscripcion) => {
    if (!actividad.inscrito) return false;
    
    const hoy = new Date().toISOString().split("T")[0];
    const fechaActividad = actividad.fechaAct;
    
    return fechaActividad > hoy;
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded text-sm">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
              Nombre
            </th>
            <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
              Fecha
            </th>
            <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
              Hora
            </th>
            <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
              Costo
            </th>
            <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
              Estado
            </th>
            <th className="px-1 py-1.5 bg-gray-50 text-center font-medium text-gray-500 uppercase tracking-wider border-b">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {actividades.map((actividad) => (
            <tr
              key={actividad.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td
                className="px-1 py-1.5 font-medium text-gray-900 truncate min-w-[100px] max-w-[120px]"
                title={actividad.nombre}
              >
                {actividad.nombre}
              </td>
              <td className="px-1 py-1.5 text-gray-500">
                {formatearFecha(actividad.fechaAct)}
              </td>
              <td className="px-1 py-1.5 text-gray-500">
                {formatearHora(actividad.horaAct)}
              </td>
              <td className="px-1 py-1.5 text-gray-900 font-medium">
                ${actividad.costoTicket}
              </td>
              <td className="px-1 py-1.5">
                {actividad.inscrito ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-green-100 text-green-800">
                    Inscrito
                  </span>
                ) : puedeInscribirse(actividad) ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
                    Disponible
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-gray-100 text-gray-400">
                    No disponible
                  </span>
                )}
              </td>
                <td className="px-1 py-1.5 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onVerDetalle(actividad)}
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                  >
                    Ver Detalle
                  </button>

                  {puedeInscribirse(actividad) && (
                    <button
                      onClick={() => onInscribir(actividad)}
                      className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-sm font-medium rounded hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200"
                    >
                      Inscribirse
                    </button>
                  )}

                  {puedeCancelar(actividad) && (
                    <button
                      onClick={() => onCancelar(actividad)}
                      className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-sm font-medium rounded hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}