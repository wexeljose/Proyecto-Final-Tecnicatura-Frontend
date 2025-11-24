"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

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
import DetalleActividad from "../../../components/layout/actividad/DetalleActividad";

export default function ListadoActividades() {
  const { data: session } = useSession();

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [filtradas, setFiltradas] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  // Modales y detalle
  const [crearModal, setCrearModal] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  const [detalleActividad, setDetalleActividad] = useState<any | null>(null);

  // Listas auxiliares (recursos y tipos)
  const [recursos, setRecursos] = useState<any[]>([]);
  const [tiposActividad, setTiposActividad] = useState<any[]>([]);
  

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

async function cargarListasAuxiliares() {
  if (!session?.accessToken) return;

  try {
    const token = session.accessToken;

    const rec = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recursos/lista`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tipos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-actividad/lista`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const recursosData = await rec.json();
    const tiposData = await tipos.json();

    setRecursos(recursosData);
    setTiposActividad(tiposData);

    console.log("👉 TIPOS DE ACTIVIDAD ->", tiposData);

  } catch (err) {
    console.error(err);
    toast.error("Error al cargar listas auxiliares ❌");
  }
}


  useEffect(() => {
    cargarActividades();
    cargarListasAuxiliares();
  }, [session]);

  // Aplicar filtros
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

    if (filtroFechaInicio) {
      filtradasTmp = filtradasTmp.filter(
        (a) => new Date(a.fechaAct) >= new Date(filtroFechaInicio)
      );
    }

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

  // Crear
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

const handleView = (actividad: Actividad) => {
  const recurso = recursos.find((r) => Number(r.id) === Number(actividad.idRecurso));

  const tipo = tiposActividad.find(
    (t) => Number(t.id) === Number(actividad.idTipoActividad)
  );

  console.log("ID tipo actividad:", actividad.idTipoActividad);
  console.log("Lista tipos:", tiposActividad);
  console.log("Tipo encontrado:", tipo);

  setDetalleActividad({
    ...actividad,
    recursoNombre: recurso?.nombre ?? "Sin nombre",
    tipoActividadNombre: tipo?.nombre ?? "Sin nombre",
  });
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
            onView={handleView}  
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

      {}
      {detalleActividad && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-2xl">
            <DetalleActividad
              actividad={detalleActividad}
              onClose={() => setDetalleActividad(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
