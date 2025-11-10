"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getReporteInscripciones } from "../../../services/inscripcion";
import { obtenerActividades } from "../../../services/actividad";
import { InscripcionActividadReporte } from "../../../../types/inscripcion";
import { Actividad } from "../../../../types/actividad";
import * as XLSX from "xlsx";

export default function ReporteInscripciones() {
  // Estados de filtros
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [cancelada, setCancelada] = useState<null | boolean>(null);
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState<number[]>([]);
  
  // Estados de datos
  const [data, setData] = useState<InscripcionActividadReporte[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingActividades, setLoadingActividades] = useState(true);

  // 🚀 Cargar actividades al montar
  useEffect(() => {
    cargarActividades();
  }, []);

  async function cargarActividades() {
    try {
      const data = await obtenerActividades();
      setActividades(data.filter(a => a.requiereInscripcion));
    } catch (error) {
      console.error("Error al cargar actividades:", error);
      toast.error("Error al cargar actividades ❌");
    } finally {
      setLoadingActividades(false);
    }
  }

  async function handleBuscar() {
    // Validaciones mejoradas
    if (!fechaDesde || !fechaHasta) {
      toast.error("Debes seleccionar ambas fechas ⚠️");
      return;
    }

    if (fechaDesde.trim() === "" || fechaHasta.trim() === "") {
      toast.error("Las fechas no pueden estar vacías ⚠️");
      return;
    }

    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      toast.error("La fecha desde no puede ser mayor a la fecha hasta ⚠️");
      return;
    }

    setLoading(true);
    setData([]); // Limpiar datos anteriores
    
    try {
      console.log("🔍 Buscando con filtros:", {
        fechaDesde,
        fechaHasta,
        cancelada,
        actividades: actividadesSeleccionadas,
      });

      const resultados = await getReporteInscripciones({
        fechaDesde,
        fechaHasta,
        cancelada,
        actividades: actividadesSeleccionadas,
      });

      console.log("✅ Resultados:", resultados);
      setData(resultados);

      if (resultados.length === 0) {
        toast("No se encontraron registros con los filtros seleccionados", {
          icon: "ℹ️",
        });
      } else {
        toast.success(`Se encontraron ${resultados.length} registros ✅`);
      }
    } catch (error: unknown) {
      console.error("❌ Error completo:", error);
      
      // Normalizar mensaje de error
      const errorMsg = error instanceof Error ? error.message : String(error);

      // Detectar tipo de error
      if (errorMsg.includes("403") || errorMsg.includes("Forbidden")) {
        toast.error("No tienes permisos para acceder a este reporte ❌");
      } else if (errorMsg.includes("400") || errorMsg.includes("Bad Request")) {
        toast.error("Error en los parámetros de búsqueda ❌");
      } else if (errorMsg.includes("500")) {
        toast.error("Error interno del servidor. Verifica los logs del backend ❌");
      } else {
        toast.error("Error al obtener el reporte ❌");
      }
    } finally {
      setLoading(false);
    }
  }

 // 📊 Exportar a Excel
  function handleExportarExcel() {
    if (data.length === 0) {
      toast.error("No hay datos para exportar ❌");
      return;
    }

    try {
      // Preparar datos para Excel
      const datosExcel = data.map((registro) => ({
        ID: registro.id,
        Actividad: registro.nombreActividad,
        Usuario: registro.emailUsuario,
        "Fecha Inscripción": formatearFecha(registro.fecInscripcion),
        Estado: registro.cancelada ? "Cancelación" : "Inscripción",
      }));

      // Crear hoja de cálculo
      const worksheet = XLSX.utils.json_to_sheet(datosExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inscripciones");

      // Ajustar anchos de columna
      const columnWidths = [
        { wch: 8 },  // ID
        { wch: 30 }, // Actividad
        { wch: 35 }, // Usuario
        { wch: 18 }, // Fecha
        { wch: 15 }, // Estado
      ];
      worksheet["!cols"] = columnWidths;

      // Generar nombre de archivo con fecha actual
      const fechaActual = new Date().toISOString().split("T")[0];
      const nombreArchivo = `Reporte_Inscripciones_${fechaActual}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(workbook, nombreArchivo);

      toast.success(`Archivo exportado: ${nombreArchivo} ✅`);
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Error al exportar a Excel ❌");
    }
  }

  const formatearFecha = (fecha: string) => {
    if (!fecha) return "-";
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  const toggleActividad = (id: number) => {
    setActividadesSeleccionadas(prev => 
      prev.includes(id) 
        ? prev.filter(actId => actId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">
        Reporte de Inscripciones / Cancelaciones
      </h1>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded shadow p-4 mb-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          {/* Fecha Desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde *
            </label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta *
            </label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => {
                const val = e.target.value;
                setCancelada(val === "ALL" ? null : val === "true");
              }}
              defaultValue="ALL"
            >
              <option value="ALL">Ambas</option>
              <option value="false">Inscripciones</option>
              <option value="true">Cancelaciones</option>
            </select>
          </div>
        </div>

        {/* Actividades */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Actividades (opcional)
          </label>
          {loadingActividades ? (
            <p className="text-sm text-gray-500">Cargando actividades...</p>
          ) : (
            <div className="border border-gray-200 rounded p-2 max-h-32 overflow-y-auto bg-gray-50">
              {actividades.length === 0 ? (
                <p className="text-sm text-gray-500">No hay actividades disponibles</p>
              ) : (
                actividades.map((act) => (
                  <label
                    key={act.id}
                    className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={actividadesSeleccionadas.includes(act.id)}
                      onChange={() => toggleActividad(act.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900">{act.nombre}</span>
                  </label>
                ))
              )}
            </div>
          )}
          {actividadesSeleccionadas.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {actividadesSeleccionadas.length} actividad(es) seleccionada(s)
            </p>
          )}
        </div>

        {/* Botón Buscar */}
        <div className="mt-3">
          <button
            onClick={handleBuscar}
            disabled={loading || !fechaDesde || !fechaHasta}
            className="inline-flex items-center px-2 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
        {/* Botón Exportar Excel */}
        {data.length > 0 && (
          <div className="mt-3">
            <button
              onClick={handleExportarExcel}
              className="inline-flex items-center px-2 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200"
            >
              Exportar a Excel
            </button>
          </div>
        )}

      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white border border-gray-200 rounded shadow">
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Cargando datos...
          </div>
        ) : data.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No hay datos. Selecciona los filtros y presiona <span className="font-medium text-gray-900">Buscar</span>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white text-sm">
              <thead>
                <tr>
                  <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
                    ID
                  </th>
                  <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
                    Actividad
                  </th>
                  <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
                    Usuario
                  </th>
                  <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
                    Fecha
                  </th>
                  <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((registro) => (
                  <tr
                    key={registro.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-1 py-1.5 text-gray-900">{registro.id}</td>
                    <td className="px-1 py-1.5 text-gray-900 font-medium">
                      {registro.nombreActividad}
                    </td>
                    <td className="px-1 py-1.5 text-gray-500">
                      {registro.emailUsuario}
                    </td>
                    <td className="px-1 py-1.5 text-gray-500">
                      {formatearFecha(registro.fecInscripcion)}
                    </td>
                    <td className="px-1 py-1.5">
                      {registro.cancelada ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-red-100 text-red-800">
                          Cancelación
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-green-100 text-green-800">
                          Inscripción
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumen */}
      {data.length > 0 && (
        <div className="mt-3 text-sm text-gray-500">
          Total de registros: <span className="font-medium text-gray-900">{data.length}</span>
        </div>
      )}
    </div>
  );
}