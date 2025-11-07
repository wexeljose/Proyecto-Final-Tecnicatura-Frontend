// services/inscripcion.ts

import { getSession } from "next-auth/react";
import { InscripcionActividad, CreateInscripcion } from "../../types/inscripcion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Obtener todas las inscripciones de un usuario
export async function obtenerInscripcionesPorUsuario(
  idUsuario: number
): Promise<InscripcionActividad[]> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/inscripciones/usuario/${idUsuario}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al obtener inscripciones: ${text}`);
  }

  return response.json();
}

// Crear nueva inscripción
export async function crearInscripcion(
  data: CreateInscripcion
): Promise<InscripcionActividad> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/inscripciones/nueva`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al crear inscripción: ${text}`);
  }

  return response.json();
}

// Cancelar inscripción
export async function cancelarInscripcion(id: number): Promise<void> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/inscripciones/${id}/cancelar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al cancelar inscripción: ${text}`);
  }

  // 204 No Content - éxito
  if (response.status === 204) return;

  try {
    return await response.json();
  } catch {
    return;
  }
}

// Buscar inscripción específica por usuario y actividad
export async function buscarInscripcionPorUsuarioYActividad(
  idUsuario: number,
  idActividad: number
): Promise<InscripcionActividad | null> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(
    `${API_URL}/inscripciones/usuario/${idUsuario}/actividad/${idActividad}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al buscar inscripción: ${text}`);
  }

  return response.json();
}

// Obtener todas las actividades inscribibles
export async function obtenerActividadesInscribibles()
: Promise<InscripcionActividad[]> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/actividades/lista/inscripcion`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al obtener actividades inscribibles: ${text}`);
  }

  return response.json();
}