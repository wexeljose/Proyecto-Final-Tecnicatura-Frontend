import { getSession } from "next-auth/react";
import { Recurso, RecursoCreate, RecursoUpdate } from "../../types/recurso";

const BASE = process.env.NEXT_PUBLIC_API_URL;

async function authFetch(path: string, init?: RequestInit) {
    const sesion = await getSession();
    const token = (sesion)?.accessToken;
    const headers = new Headers(init?.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");
    const res = await fetch(`${BASE}${path}`, { ...init, headers, credentials: "include" });
    if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
    return res;
}

// Crear
export async function crearRecurso(data: RecursoCreate): Promise<Recurso> {
    const r = await authFetch(`/recursos/crear`, { method: "POST", body: JSON.stringify(data) });
    return r.json();
}

// Modificar
export async function actualizarRecurso(id: number, data: RecursoUpdate): Promise<Recurso> {
    const r = await authFetch(`/recursos/${id}/modificar`, { method: "PUT", body: JSON.stringify(data) });
    return r.json();
}

// Baja lógica
export async function darDeBajaRecurso(id: number): Promise<void> {
    await authFetch(`/recursos/${id}/baja`, { method: "PUT" });
}

// Obtener por ID
export async function obtenerRecurso(id: number): Promise<Recurso> {
    const r = await authFetch(`/recursos/${id}`, { method: "GET" });
    return r.json();
}

// Listar por estado
export async function listarRecursosPorEstado(estado: "Activos"|"Inactivos"|"Sin_validar") {
    const sesion = await getSession();
    const tipo = sesion?.user?.tipoUsuario;

    // ✅ AuxiliarAdm: puede ver estados
    if (tipo === "AuxiliarAdm") {
        const r = await authFetch(`/recursos/lista/estado?estado=${encodeURIComponent(estado)}`, { method: "GET" });
        return r.json();
    }

    // ✅ Socio: devuelve lista normal
    if (tipo === "Socio") {
        const r = await authFetch(`/recursos/lista`, { method: "GET" });
        return r.json();
    }

    // ✅ NoSocio: NO puede ver recursos
    return [];
}


// Buscar por nombre que contenga
export async function buscarRecursosPorNombre(nombre: string): Promise<Recurso[]> {
    const r = await authFetch(`/recursos/lista/nombre?nombre=${encodeURIComponent(nombre)}`, { method: "GET" });
    return r.json();
}

// Buscar por capacidad mínima
export async function buscarRecursosPorCapacidad(capacidad: number): Promise<Recurso[]> {
    const r = await authFetch(`/recursos/lista/capacidad?capacidad=${capacidad}`, { method: "GET" });
    return r.json();
}