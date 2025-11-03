import { getSession } from "next-auth/react";
import { UpdatePerfil } from "../../types/perfil";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Obtener la lista de perfiles
export async function obtenerPerfiles() {

  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/perfiles/lista`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al obtener perfiles: ${text}`);
  }

  return response.json();
}

// Eliminar un perfil por ID
export async function eliminarPerfil(id: number) {
  const session = await getSession();
  const token = session?.accessToken;

  const response = await fetch(`${API_URL}/perfiles/${id}/baja`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error al eliminar perfil: ${text}`);
  }

  // 204 (sin contenido)
  if (response.status === 204) return true;

  // Si el backend devuelve algo, lo parseamos
  try {
    return await response.json();
  } catch {
    return true; // sin contenido, pero éxito
  }
}

// Actualizar un perfil por ID
  export async function actualizarPerfil(id: number, data: UpdatePerfil) {

    const session = await getSession();
    const token = session?.accessToken;

    const response = await fetch(`${API_URL}/perfiles/${id}/modificar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al actualizar perfil: ${text}`);
    }

    return response.json();
  }
