"use client";

import TipoActividadTable from "../../../components/layout/tipoActividad/TipoActividadTable";
import ModalBajaTipoActividad from "../../../components/layout/tipoActividad/ModalBajaActividad";
import { useState } from "react";
import { TipoActividad } from "../../../types/tipoDeActividad";

export default function Page() {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoActividad | null>(null);

  return (
    <>
      <TipoActividadTable
        abrirModalBaja={(tipo) => setTipoSeleccionado(tipo)}
      />

      {tipoSeleccionado && (
        <ModalBajaTipoActividad
          tipoActividad={tipoSeleccionado}
          onClose={() => setTipoSeleccionado(null)}
        />
      )}
    </>
  );
}
