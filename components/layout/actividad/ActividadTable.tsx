"use client";
import { Actividad } from "../../../types/actividad";

interface Props {
  actividades: Actividad[];
  onEdit: (actividad: Actividad) => void;
  onDelete: (id: number) => void;
  onView: (actividad: Actividad) => void;  // <-- AGREGADO
}

export default function ActividadTable({ actividades, onEdit, onDelete, onView }: Props) {
  if (!actividades.length) {
    return <p className="text-gray-600">No hay actividades registradas.</p>;
  }

  return (
    <table className="w-full border border-gray-300 shadow-sm rounded-lg">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-2 text-left">Nombre</th>
          <th className="p-2 text-left">Fecha</th>
          <th className="p-2 text-left">Hora</th>
          <th className="p-2 text-left">Duración</th>
          <th className="p-2 text-left">Costo</th>
          <th className="p-2 text-left">Estado</th>
          <th className="p-2 text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {actividades.map((a) => (
          <tr key={a.id} className="border-t hover:bg-gray-50">
            <td className="p-2">{a.nombre}</td>
            <td className="p-2">{a.fechaAct}</td>
            <td className="p-2">{a.horaAct}</td>
            <td className="p-2">{a.duracion}</td>
            <td className="p-2">${a.costoTicket}</td>
            <td className="p-2">{a.estado || "Activo"}</td>

            <td className="p-2 text-center flex gap-2 justify-center">
              <button
                onClick={() => onView(a)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Ver detalle
              </button>

              <button
                onClick={() => onEdit(a)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Editar
              </button>

              <button
                onClick={() => onDelete(a.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
