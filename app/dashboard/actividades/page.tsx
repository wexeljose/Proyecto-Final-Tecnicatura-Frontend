"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Servicios
import {
  obtenerActividades,
  eliminarActividad,
  actualizarActividad,
  crearActividad,
} from "../../services/actividad";

// Tipos
import { Actividad, UpdateActividad } from "../../../types/actividad";

// Componentes
import ActividadTable from "../../../components/layout/actividad/ActividadTable";
import EditActividadModal from "../../../components/layout/actividad/ActividadEditModal";
import CrearActividadModal from "../../../components/layout/actividad/ActividadCreateModal";
import ActividadFiltrosLayout from "../../../components/layout/actividad/ActividadFiltrosLayout";

export default function ListadoActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [filtradas, setFiltradas] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  // Modales
  const [crearModal, setCrearModal] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);

  // Cargar actividades
  async function cargarActividades() {
    setLoading(true);
    try {
      const data = await obtenerActividades();
      data.sort((a, b) => a.id - b.id);
      setActividades(data);
      setFiltradas(data);
    } catch {
      toast.error("Error al cargar actividades ❌");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarActividades();
  }, []);

  // Aplicar filtros
  const aplicarFiltros = () => {
    let filtradasTmp = [...actividades];

    // Nombre
    if (filtroNombre.trim()) {
      filtradasTmp = filtradasTmp.filter((a) =>
        a.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      );
    }

    // Estado
    if (filtroEstado) {
      filtradasTmp = filtradasTmp.filter((a) => a.estado === filtroEstado);
    }

    // Fecha inicio
    if (filtroFechaInicio) {
      filtradasTmp = filtradasTmp.filter(
        (a) => new Date(a.fechaAct) >= new Date(filtroFechaInicio)
      );
    }

    // Fecha fin
    if (filtroFechaFin) {
      filtradasTmp = filtradasTmp.filter(
        (a) => new Date(a.fechaAct) <= new Date(filtroFechaFin)
      );
    }

    setFiltradas(filtradasTmp);
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroEstado("");
    setFiltroFechaInicio("");
    setFiltroFechaFin("");
    setFiltradas(actividades);
  };

  // Eliminar
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta actividad?")) return;

    try {
      await eliminarActividad(id);
      toast.success("Actividad eliminada");
      await cargarActividades();
    } catch {
      toast.error("No se pudo eliminar");
    }
  };

  // Editar
  const handleEdit = (actividad: Actividad) => {
    setSelectedActividad(actividad);
  };

  // Guardar edición
  const handleSave = async (id: number, data: UpdateActividad) => {
    try {
      await actualizarActividad(id, data);
      toast.success("Actualizada");
      await cargarActividades();
      setSelectedActividad(null);
    } catch {
      toast.error("No se pudo actualizar");
    }
  };

  // Crear actividad
  const handleCrear = async (data: any) => {
    try {
      await crearActividad(data);
      toast.success("Actividad creada");
      await cargarActividades();
      setCrearModal(false);
    } catch {
      toast.error("Error al crear");
    }
  };

  if (loading) return <p>Cargando actividades...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestión de Actividades</h1>

      <div className="flex gap-6">
        <div className="flex-1">
          <ActividadTable
            actividades={filtradas}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <ActividadFiltrosLayout
          filtroNombre={filtroNombre}
          setFiltroNombre={setFiltroNombre}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          filtroFechaInicio={filtroFechaInicio}
          setFiltroFechaInicio={setFiltroFechaInicio}
          filtroFechaFin={filtroFechaFin}
          setFiltroFechaFin={setFiltroFechaFin}
          aplicarFiltros={aplicarFiltros}
          limpiarFiltros={limpiarFiltros}
          onCrear={() => setCrearModal(true)}
        />
      </div>

      {selectedActividad && (
        <EditActividadModal
          actividad={selectedActividad}
          onClose={() => setSelectedActividad(null)}
          onSave={handleSave}
        />
      )}

      {crearModal && (
        <CrearActividadModal
          onClose={() => setCrearModal(false)}
          onCrear={handleCrear}
        />
      )}
    </div>
  );
}
