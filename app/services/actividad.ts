import { getSession } from "next-auth/react";
import { Actividad, CreateActividad, UpdateActividad } from "../../types/actividad";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // mismo patrón que perfiles

// Obtener todas las actividades
export async function obtenerActividades(): Promise<Actividad[]> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/actividades/lista`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
});


  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al obtener actividades: ${text}`);
  }

  return response.json();
}

// Crear una nueva actividad
export async function crearActividad(data: CreateActividad) {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/actividades/crear`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al crear actividad: ${text}`);
  }

  return response.json();
}

// Actualizar una actividad existente
export async function actualizarActividad(id: number, data: UpdateActividad) {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/actividades/${id}/modificar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al actualizar actividad: ${text}`);
  }

  return response.json();
}

// Eliminar una actividad
export async function eliminarActividad(id: number) {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/actividades/${id}/baja`, {
    method: "PUT", // si tu backend usa baja lógica
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al eliminar actividad: ${text}`);
  }

  if (response.status === 204) return true;

  try {
    return await response.json();
  } catch {
    return true;
  }
}
