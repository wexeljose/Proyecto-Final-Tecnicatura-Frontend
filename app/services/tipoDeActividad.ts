// services/tipoActividad.ts

import { getSession } from "next-auth/react";
import { TipoActividad } from "../../types/tipoDeActividad";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function obtenerTiposDeActividad(): Promise<TipoActividad[]> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/tipo-actividad/lista`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al obtener tipos de actividad: ${text}`);
  }

  return response.json();
}
