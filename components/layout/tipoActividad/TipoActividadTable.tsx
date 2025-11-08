"use client";

import { useEffect, useState } from "react";
import { obtenerTiposDeActividad} from "../../../app/services/tipoDeActividad";
import { TipoActividad } from "../../../types/tipoDeActividad";
import { confirmarAccion } from "../../../.idea/utils/confirmarAccion";
import toast from "react-hot-toast";

export default function TipoActividadTable({ abrirModalBaja }: {
  abrirModalBaja: (tipoActividad: TipoActividad) => void;
}) {
  const [tipos, setTipos] = useState<TipoActividad[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚀 Cargar datos al montar
  useEffect(() => {
    async function loadData() {
      try {
        const data = await obtenerTiposDeActividad();
        console.log("Tipos de actividad cargados:", data);
        setTipos(data);
      } catch (error) {
        console.error("Error al obtener tipos de actividad:", error);
        toast.error("Error al obtener tipos de actividad");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleDarDeBaja = async (tipo: TipoActividad) => {
    const confirmar = await confirmarAccion(
      `¿Seguro que deseas dar de baja el tipo: "${tipo.nombre}"?`
    );

    if (!confirmar) return;

    // abrir modal para ingresar los datos de baja
    abrirModalBaja(tipo);
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-700">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Descripción</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tipos.map((tipo) => (
            <tr key={tipo.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3">{tipo.id}</td>
              <td className="px-4 py-3">{tipo.nombre}</td>
              <td className="px-4 py-3">{tipo.descripcion}</td>

              {/* Estado */}
              <td className="px-4 py-3">
                {/* Estado activo/inactivo/sin validar */}
                {tipo.estado === "Activos" ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Activo
                </span>
                ) : tipo.estado === "Inactivos" ? (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    Inactivo
                </span>
                ) : (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Sin validar
                </span>
                )}
              </td>

              {/* Acciones */}
              <td className="px-4 py-3 text-right">
                {tipo.estado === "Activos" ? (
                  <button
                    onClick={() => handleDarDeBaja(tipo)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Dar de baja
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
