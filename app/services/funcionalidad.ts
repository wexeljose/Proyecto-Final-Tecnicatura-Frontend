import { getSession } from "next-auth/react";
import { Funcionalidad, FuncionalidadCreate, FuncionalidadUpdate, PerfilFuncionalidadDTO} from "../../types/funcionalidades";

const BASE = process.env.NEXT_PUBLIC_API_URL;

async function authFetch(path: string, init?: RequestInit) {
    const sesion = await getSession();
    const token = sesion?.accessToken;
    const headers = new Headers(init?.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");
    const res = await fetch(`${BASE}${path}`, { ...init, headers, credentials: "include" });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error HTTP ${res.status}`);
    }
    return res;
}

// RF003-02: Listar
export async function obtenerFuncionalidades(): Promise<Funcionalidad[]> {
    const r = await authFetch(`/funcionalidades/lista`, { method: "GET" });
    return r.json();
}
export async function obtenerFuncionalidadesActivas(): Promise<Funcionalidad[]> {
    const r = await authFetch(`/funcionalidades/activas`, { method: "GET" });
    return r.json();
}

// RF003-01: Crear
export async function crearFuncionalidad(data: FuncionalidadCreate): Promise<Funcionalidad> {
    const r = await authFetch(`/funcionalidades/crear`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return r.json();
}

// RF003-03: Modificar
export async function actualizarFuncionalidad(id: number, data: FuncionalidadUpdate): Promise<Funcionalidad> {
    const r = await authFetch(`/funcionalidades/${id}/modificar`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    return r.json();
}

// RF003-04: Baja lógica
export async function bajaFuncionalidad(id: number): Promise<void> {
    await authFetch(`/funcionalidades/${id}/baja`, { method: "PUT" });
}

// RF003-05: asociar 1 funcionalidad a un perfil (individual)
export async function asociarFuncionalidadAPerfil(idFuncionalidad: number, idPerfil: number) {
    const body = { idPerfil, idFuncionalidad };
    await authFetch(`/funcionalidades/${idFuncionalidad}/asociar-perfil`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

// RF003-06: actualizar accesos de un perfil (bulk) -> body: number[]
export async function actualizarAccesosPerfil(idPerfil: number, idsFuncionalidades: number[]) {
    await authFetch(`/funcionalidades/perfil/${idPerfil}/accesos`, {
        method: "PUT",
        body: JSON.stringify(idsFuncionalidades),
    });
}

// Listar relaciones por perfil (ids + estado)
export async function listarFuncionalidadesPorPerfil(idPerfil: number): Promise<PerfilFuncionalidadDTO[]> {
    const r = await authFetch(`/funcionalidades/perfil/${idPerfil}/lista`, { method: "GET" });
    return r.json();
}