// services/inscripcion.ts

import { getSession } from "next-auth/react";
import { InscripcionActividad, CreateInscripcion } from "../../types/inscripcion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Obtener todas las inscripciones de un usuario (incluidas canceladas)
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

// Rehabilitar inscripción cancelada
export async function rehabilitarInscripcion(id: number): Promise<void> {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/inscripciones/${id}/rehabilitar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al rehabilitar inscripción: ${text}`);
  }

  // 204 No Content - éxito
  if (response.status === 204) return;

  try {
    return await response.json();
  } catch {
    return;
  }
}

// Inscribir o reinscribir (lógica inteligente)
export async function inscribirORehabilitarActividad(
  data: CreateInscripcion
): Promise<InscripcionActividad> {
  const session = await getSession();
  const token = session?.accessToken;

  // 1. Primero buscar si existe una inscripción para este usuario y actividad
  const buscarResponse = await fetch(
    `${API_URL}/inscripciones/usuario/${data.idUsuario}/actividad/${data.idActividad}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Si encontró una inscripción existente (200)
  if (buscarResponse.ok) {
    const inscripcionExistente: InscripcionActividad = await buscarResponse.json();
    
    // Si está cancelada, rehabilitarla
    if (inscripcionExistente.cancelada) {
      await rehabilitarInscripcion(inscripcionExistente.id);
      
      // Devolver la inscripción rehabilitada
      return {
        ...inscripcionExistente,
        cancelada: false,
      };
    } else {
      // Si ya está activa, lanzar error
      throw new Error("Ya estás inscrito en esta actividad");
    }
  }

  // Si no existe (404), crear nueva inscripción
  if (buscarResponse.status === 404) {
    return await crearInscripcion(data);
  }

  // Si hubo otro error
  const errorText = await buscarResponse.text();
  throw new Error(`Error al verificar inscripción: ${errorText}`);
}

// Crear nueva inscripción (método interno)
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