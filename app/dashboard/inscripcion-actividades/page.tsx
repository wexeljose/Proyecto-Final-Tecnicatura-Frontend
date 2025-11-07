// app/dashboard/inscripcion-actividades/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

// Servicios
import { obtenerActividades } from "../../services/actividad";
import {
  obtenerInscripcionesPorUsuario,
  inscribirORehabilitarActividad,
  cancelarInscripcion,
} from "../../services/inscripcion";

// Tipos
import {
  ActividadConInscripcion,
  FiltrosInscripcion,
} from "../../../types/inscripcion";
import { Actividad } from "../../../types/actividad";

// Componentes
import ActividadInscripcionTable from "../../../components/layout/inscripcion/ActividadInscripcionTable";
import InscripcionFiltrosLayout from "../../../components/layout/inscripcion/InscripcionFiltrosLayout";
import ActividadDetalleModal from "../../../components/layout/inscripcion/ActividadDetalleModal";
import { confirmarAccion } from "../../../.idea/utils/confirmarAccion";

export default function InscripcionActividadesPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [actividades, setActividades] = useState<ActividadConInscripcion[]>([]);
  const [filtradas, setFiltradas] = useState<ActividadConInscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActividad, setSelectedActividad] =
    useState<ActividadConInscripcion | null>(null);

  const [filtros, setFiltros] = useState<FiltrosInscripcion>({
    nombre: "",
    tipoActividad: "",
    fechaDesde: "",
    fechaHasta: "",
    costoMin: "",
    costoMax: "",
    estado: "",
  });

  // 🚀 Cargar datos iniciales
  const cargarDatos = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Cargar actividades que requieren inscripción
      const [todasActividades, misInscripciones] = await Promise.all([
        obtenerActividades(),
        obtenerInscripcionesPorUsuario(Number(userId)),
      ]);

      // Filtrar solo actividades que requieren inscripción
      const actividadesInscribibles = todasActividades.filter(
        (a: Actividad) => a.requiereInscripcion
      );

      // Crear un mapa de inscripciones por actividad (incluyendo canceladas)
      const inscripcionesMap = new Map(
        misInscripciones.map((i) => [i.idActividad, i])
      );

      // Combinar información
      const actividadesConInscripcion: ActividadConInscripcion[] =
        actividadesInscribibles.map((act: Actividad) => {
          const inscripcion = inscripcionesMap.get(act.id);
          return {
            ...act,
            formaPago: act.formaPago || null,
            observaciones: act.observaciones || null,
            // Solo está inscrito si existe Y no está cancelada
            inscrito: !!(inscripcion && !inscripcion.cancelada),
            idInscripcion: inscripcion?.id,
            fechaInscripcion: inscripcion?.fecInscripcion,
          };
        });

      setActividades(actividadesConInscripcion);
      setFiltradas(actividadesConInscripcion);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar actividades ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log("✅ Cargando datos con userId:", userId);
      cargarDatos();
    } else {
      console.log("⚠️ No hay userId, esperando sesión...");
    }
  }, [userId]);

  // 🔍 Aplicar filtros
  const aplicarFiltros = () => {
    let resultado = [...actividades];

    // Filtro por nombre
    if (filtros.nombre.trim()) {
      resultado = resultado.filter((a) =>
        a.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      );
    }

    // Filtro por fecha desde
    if (filtros.fechaDesde) {
      resultado = resultado.filter((a) => a.fechaAct >= filtros.fechaDesde);
    }

    // Filtro por fecha hasta
    if (filtros.fechaHasta) {
      resultado = resultado.filter((a) => a.fechaAct <= filtros.fechaHasta);
    }

    // Filtro por costo mínimo
    if (filtros.costoMin) {
      const min = parseFloat(filtros.costoMin);
      resultado = resultado.filter((a) => a.costoTicket >= min);
    }

    // Filtro por costo máximo
    if (filtros.costoMax) {
      const max = parseFloat(filtros.costoMax);
      resultado = resultado.filter((a) => a.costoTicket <= max);
    }

    // Filtro por estado
    if (filtros.estado === "disponible") {
      resultado = resultado.filter((a) => !a.inscrito);
    } else if (filtros.estado === "inscrito") {
      resultado = resultado.filter((a) => a.inscrito);
    }

    setFiltradas(resultado);
  };

  // 🧹 Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      nombre: "",
      tipoActividad: "",
      fechaDesde: "",
      fechaHasta: "",
      costoMin: "",
      costoMax: "",
      estado: "",
    });
    setFiltradas(actividades);
  };

  // ➕ Inscribirse o Reinscribirse
  const handleInscribir = async (actividad: ActividadConInscripcion) => {
    if (!userId) return;

    const confirmado = await confirmarAccion(
      `¿Confirmas tu inscripción a "${actividad.nombre}"?`
    );
    if (!confirmado) return;

    try {
      await toast.promise(
        inscribirORehabilitarActividad({
          idUsuario: Number(userId),
          idActividad: actividad.id,
        }),
        {
          loading: "Procesando inscripción...",
          success: "¡Te has inscrito correctamente! ✅",
          error: (err) => {
            // Mensaje personalizado según el error
            if (err.message.includes("Ya estás inscrito")) {
              return "Ya estás inscrito en esta actividad ⚠️";
            }
            return "No se pudo completar la inscripción ❌";
          },
        }
      );

      await cargarDatos();
      setSelectedActividad(null);
    } catch (error) {
      console.error(error);
    }
  };

  // ❌ Cancelar inscripción
  const handleCancelar = async (actividad: ActividadConInscripcion) => {
    if (!actividad.idInscripcion) return;

    const confirmado = await confirmarAccion(
      `¿Estás seguro de cancelar tu inscripción a "${actividad.nombre}"?`
    );
    if (!confirmado) return;

    try {
      await toast.promise(cancelarInscripcion(actividad.idInscripcion), {
        loading: "Cancelando inscripción...",
        success: "Inscripción cancelada correctamente ✅",
        error: "No se pudo cancelar la inscripción ❌",
      });

      await cargarDatos();
      setSelectedActividad(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 👁️ Ver detalle
  const handleVerDetalle = (actividad: ActividadConInscripcion) => {
    setSelectedActividad(actividad);
  };

  if (status === "loading") {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Cargando sesión...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">
          Error: No se pudo obtener el ID de usuario. Por favor, vuelve a iniciar sesión.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Cargando actividades...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">
        Inscripción a Actividades
      </h1>

      <div className="flex gap-6">
        {/* Tabla */}
        <div className="flex-1">
          <ActividadInscripcionTable
            actividades={filtradas}
            onVerDetalle={handleVerDetalle}
            onInscribir={handleInscribir}
            onCancelar={handleCancelar}
          />
        </div>

        {/* Panel de filtros */}
        <InscripcionFiltrosLayout
          filtros={filtros}
          setFiltros={setFiltros}
          aplicarFiltros={aplicarFiltros}
          limpiarFiltros={limpiarFiltros}
        />
      </div>

      {/* Modal de detalle */}
      {selectedActividad && (
        <ActividadDetalleModal
          actividad={selectedActividad}
          onClose={() => setSelectedActividad(null)}
          onInscribir={() => handleInscribir(selectedActividad)}
          onCancelar={() => handleCancelar(selectedActividad)}
        />
      )}
    </div>
  );
}