import { Perfil } from "../../types/perfil";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export async function obtenerPerfiles(): Promise<Perfil[]> {
  try {
    const response = await fetch(`${API_URL}/perfiles/lista`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener perfiles");
    }
    const data = await response.json();
    console.log("Perfiles obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error en obtenerPerfiles:", error);
    throw error;
  }
}
