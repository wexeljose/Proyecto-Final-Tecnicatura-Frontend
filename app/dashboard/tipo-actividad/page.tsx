"use client";

import TipoActividadTable from "../../../components/layout/tipoActividad/TipoActividadTable";
import ModalBajaTipoActividad from "../../../components/layout/tipoActividad/ModalBajaActividad";
import ModalCrearTipoActividad from "../../../components/layout/tipoActividad/ModalCrearTipoActividad";
import ModalEditarTipoActividad from "../../../components/layout/tipoActividad/ModalEditarTipoActividad";
import { useState } from "react";
import { TipoActividad } from "../../../types/tipoDeActividad";

export default function TipoActividadPage() {
  const [tipoParaBaja, setTipoParaBaja] = useState<TipoActividad | null>(null);
  const [tipoParaEditar, setTipoParaEditar] = useState<TipoActividad | null>(null);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [recargar, setRecargar] = useState(false);

  const handleActualizacionExitosa = () => {
    setRecargar(!recargar); // Toggle para forzar recarga
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">
          Gestión de Tipos de Actividad
        </h1>
        
        <button
          onClick={() => setModalCrearAbierto(true)}
          className="inline-flex items-center gap-2 px-2 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
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
            <path d="M12 4v16m8-8H4" />
          </svg>
          Crear tipo de actividad
        </button>
      </div>

      {/* Tabla */}
      <TipoActividadTable
        abrirModalBaja={(tipo) => setTipoParaBaja(tipo)}
        abrirModalEditar={(tipo) => setTipoParaEditar(tipo)}
        recargar={recargar}
      />

      {/* Modal Baja */}
      {tipoParaBaja && (
        <ModalBajaTipoActividad
          tipoActividad={tipoParaBaja}
          onClose={() => setTipoParaBaja(null)}
          onSuccess={() => {
            handleActualizacionExitosa();
            setTipoParaBaja(null);
          }}
        />
      )}

      {/* Modal Editar */}
      {tipoParaEditar && (
        <ModalEditarTipoActividad
          tipo={tipoParaEditar}
          onClose={() => setTipoParaEditar(null)}
          onUpdated={() => {
            handleActualizacionExitosa();
            setTipoParaEditar(null);
          }}
        />
      )}

      {/* Modal Crear */}
      {modalCrearAbierto && (
        <ModalCrearTipoActividad
          onClose={() => {
            setModalCrearAbierto(false);
            handleActualizacionExitosa();
          }}
        />
      )}
    </div>
  );
}