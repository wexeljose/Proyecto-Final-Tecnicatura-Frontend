// src/components/SelectTipoActividad.tsx

"use client";

import { useEffect, useState } from "react";
import { TipoActividad } from "../../../types/tipoDeActividad";
import { obtenerTiposDeActividad } from "../../../app/services/tipoDeActividad";

interface Props {
  value: number[];
  onChange: (selected: number[]) => void;
}

export default function SelectTipoActividad({ value, onChange }: Props) {
  const [tipos, setTipos] = useState<TipoActividad[]>([]);

  useEffect(() => {
    obtenerTiposDeActividad().then(setTipos);
  }, []);

  return (
    <select
      multiple
      className="border rounded-md p-2 w-full"
      value={value.map(String)}
      onChange={(e) => {
        const seleccionados = Array.from(e.target.selectedOptions).map((o) =>
          Number(o.value)
        );
        onChange(seleccionados);
      }}
    >
      {tipos.map((tipo) => (
        <option key={tipo.id} value={tipo.id}>
          {tipo.nombre}
        </option>
      ))}
    </select>
  );
}
