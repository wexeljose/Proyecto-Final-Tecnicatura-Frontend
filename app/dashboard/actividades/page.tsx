"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// 🧩 Servicios
import {
  obtenerActividades,
  eliminarActividad,
  actualizarActividad,
  crearActividad,
} from "../../services/actividad";

// 🧾 Tipos
import { Actividad, UpdateActividad } from "../../../types/actividad";

// 🧱 Componentes
import ActividadTable from "../../../components/layout/actividad/ActividadTable";
import EditActividadModal from "../../../components/layout/actividad/ActividadEditModal";
import CrearActividadModal from "../../../components/layout/actividad/ActividadCreateModal";
import ActividadFiltrosLayout from "../../../components/layout/actividad/ActividadFiltrosLayout";

export default function ListadoActividades() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [crearModal, setCrearModal] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  const [filtradas, setFiltradas] = useState<Actividad[]>([]);

  // 🚀 Cargar actividades
  async function cargarActividades() {
    setLoading(true);
    try {
      const data = await obtenerActividades();
      data.sort((a, b) => a.id - b.id);
      setActividades(data);
      setFiltradas(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar actividades ❌");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarActividades();
  }, []);

  // 🔍 Filtros
  const aplicarFiltros = () => {
    let filtradasTmp = [...actividades];
    if (filtroNombre.trim()) {
      filtradasTmp = filtradasTmp.filter((a) =>
        a.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      );
    }
    if (filtroEstado) {
      filtradasTmp = filtradasTmp.filter((a) => a.estado === filtroEstado);
    }
    setFiltradas(filtradasTmp);
  };

  // 🗑️ Eliminar
  const handleDelete = async (id: number) => {
    const confirmado = window.confirm("¿Seguro que deseas eliminar esta actividad?");
    if (!confirmado) return;

    try {
      await toast.promise(eliminarActividad(id), {
        loading: "Eliminando...",
        success: "Actividad eliminada ✅",
        error: "No se pudo eliminar ❌",
      });
      await cargarActividades();
    } catch (error) {
      console.error(error);
    }
  };

  // ✏️ Editar
  const handleEdit = (actividad: Actividad) => {
    setSelectedActividad(actividad);
  };

  // 💾 Guardar cambios
  const handleSave = async (id: number, data: UpdateActividad) => {
    const confirmado = window.confirm("¿Confirmas la modificación?");
    if (!confirmado) return;

    try {
      await actualizarActividad(id, data);
      toast.success("Actividad actualizada ✅");
      await cargarActividades();
      setSelectedActividad(null);
    } catch {
      toast.error("Error al actualizar ❌");
    }
  };

  // ➕ Crear
  const handleCrear = async (data: any) => {
    try {
      await crearActividad(data);
      toast.success("Actividad creada ✅");
      await cargarActividades();
      setCrearModal(false);
    } catch {
      toast.error("Error al crear ❌");
    }
  };

  // 🧠 Verificar importaciones
  console.log({
    ActividadTable,
    EditActividadModal,
    CrearActividadModal,
    ActividadFiltrosLayout,
  });

  if (loading) return <p>Cargando actividades...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestión de Actividades</h1>

      <div className="flex gap-6">
        {/* Tabla */}
        <div className="flex-1">
          <ActividadTable
            actividades={filtradas}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Panel de filtros */}
        <ActividadFiltrosLayout
          filtroNombre={filtroNombre}
          setFiltroNombre={setFiltroNombre}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          aplicarFiltros={aplicarFiltros}
          onCrear={() => setCrearModal(true)}
        />
      </div>

      {/* Modal editar */}
      {selectedActividad && (
        <EditActividadModal
          actividad={selectedActividad}
          onClose={() => setSelectedActividad(null)}
          onSave={handleSave}
        />
      )}

      {/* Modal crear */}
      {crearModal && (
        <CrearActividadModal
          onClose={() => setCrearModal(false)}
          onCrear={handleCrear}
        />
      )}
    </div>
  );
}
