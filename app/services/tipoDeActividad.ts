// services/tipoActividad.ts

import { getSession } from "next-auth/react";
import { TipoActividad, CreateTipoActividad, TipoActividadBajaDTO } from "../../types/tipoDeActividad";

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

// Crear tipo de actividad
export async function crearTipoDeActividad(
  data: CreateTipoActividad
): Promise<TipoActividad> {
  const session = await getSession();
  const token = session?.accessToken;
  const response = await fetch(`${API_URL}/tipo-actividad/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al crear tipo de actividad: ${text}`);
  }

  return response.json();
}

// Modificar tipo de actividad
export async function modificarDescripcionTipoDeActividad(
  id: number,
  descripcion: string
): Promise<TipoActividad> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/tipo-actividad/${id}/modificar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ descripcion }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al modificar descripción del tipo de actividad: ${error}`);
  }

  return response.json();
}


//Dar de baja logica 
export async function darDeBajaTipoDeActividad(
  id: number,
  data: TipoActividadBajaDTO 
): Promise<void> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/tipo-actividad/${id}/baja`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al dar de baja el tipo de actividad: ${error}`);
  }
}


//Activar tipo de actividad
export async function activarTipoDeActividad(id: number): Promise<void> {
  const session = await getSession();
  const token = session?.accessToken;
  const response = await fetch(`${API_URL}/tipo-actividad/${id}/activar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al activar el tipo de actividad: ${error}`);
  }
}

// Obtener tipo de actividad por ID
export async function obtenerTipoDeActividadPorId(id: number): Promise<TipoActividad> {
  const session = await getSession();
  const token = session?.accessToken;
  const response = await fetch(`${API_URL}/tipo-actividad/${id}/detalles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al obtener el tipo de actividad por ID: ${error}`);
  }

  return response.json();
}