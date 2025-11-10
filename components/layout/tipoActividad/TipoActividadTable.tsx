"use client";

import { useEffect, useState } from "react";
import { obtenerTiposDeActividad, activarTipoDeActividad } from "../../../app/services/tipoDeActividad";
import { TipoActividad } from "../../../types/tipoDeActividad";
import { confirmarAccion } from "../../../.idea/utils/confirmarAccion";
import toast from "react-hot-toast";

interface Props {
  abrirModalBaja: (tipoActividad: TipoActividad) => void;
  abrirModalEditar: (tipoActividad: TipoActividad) => void;
  recargar: boolean;
}

export default function TipoActividadTable({ 
  abrirModalBaja, 
  abrirModalEditar,
  recargar 
}: Props) {
  const [tipos, setTipos] = useState<TipoActividad[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚀 Cargar datos
  const cargarDatos = async () => {
    try {
      const data = await obtenerTiposDeActividad();
      console.log("Tipos de actividad cargados:", data);
      setTipos(data);
    } catch (error) {
      console.error("Error al obtener tipos de actividad:", error);
      toast.error("Error al obtener tipos de actividad ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [recargar]);

  // ✅ Validar/Activar tipo (solo para "Sin validar")
  const handleValidar = async (tipo: TipoActividad) => {
    const confirmar = await confirmarAccion(
      `¿Confirmas validar el tipo: "${tipo.nombre}"?`
    );
    if (!confirmar) return;

    try {
      await toast.promise(
        activarTipoDeActividad(tipo.id),
        {
          loading: "Validando tipo...",
          success: "Tipo de actividad validado ✅",
          error: "Error al validar ❌",
        }
      );
      await cargarDatos();
    } catch (error) {
      console.error(error);
    }
  };

  // ❌ Dar de baja (para "Activos" y "Sin validar")
  const handleDarDeBaja = async (tipo: TipoActividad) => {
    const confirmar = await confirmarAccion(
      `¿Seguro que deseas dar de baja el tipo: "${tipo.nombre}"?`
    );
    if (!confirmar) return;
    abrirModalBaja(tipo);
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Cargando tipos de actividad...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded text-sm">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
              ID
            </th>
            <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
              Nombre
            </th>
            <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
              Descripción
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
          {tipos.map((tipo) => (
            <tr key={tipo.id} className="hover:bg-gray-50 transition-colors duration-200">
              <td className="px-1 py-1.5 text-gray-900">{tipo.id}</td>
              <td className="px-1 py-1.5 text-gray-900 font-medium">{tipo.nombre}</td>
              <td className="px-1 py-1.5 text-gray-500">
                <div className="line-clamp-2 break-words max-w-xs" title={tipo.descripcion}>
                  {tipo.descripcion}
                </div>
              </td>
              
              {/* Estado */}
              <td className="px-1 py-1.5">
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
              </td>

              {/* Acciones */}
              <td className="px-1 py-1.5 text-center">
                <div className="flex justify-center gap-2">
                  {/* ACTIVOS: Editar y Dar de baja */}
                  {tipo.estado === "Activos" && (
                    <>
                      <button
                        onClick={() => abrirModalEditar(tipo)}
                        className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDarDeBaja(tipo)}
                        className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-sm font-medium rounded hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200"
                      >
                        Dar de baja
                      </button>
                    </>
                  )}

                  {/* SIN VALIDAR: Validar, Editar y Dar de baja */}
                  {tipo.estado === "Sin_validar" && (
                    <>
                      <button
                        onClick={() => handleValidar(tipo)}
                        className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-sm font-medium rounded hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200"
                      >
                        Validar
                      </button>
                      <button
                        onClick={() => abrirModalEditar(tipo)}
                        className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDarDeBaja(tipo)}
                        className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-sm font-medium rounded hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200"
                      >
                        Dar de baja
                      </button>
                    </>
                  )}

                  {/* INACTIVOS: Sin acciones */}
                  {tipo.estado === "Inactivos" && (
                    <span className="text-sm text-gray-400">Sin acciones disponibles</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tipos.length === 0 && (
        <div className="p-4 text-center text-sm text-gray-500">
          No hay tipos de actividad registrados.
        </div>
      )}
    </div>
  );
}