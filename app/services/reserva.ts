import { getSession } from "next-auth/react";
import type { Reserva, ReservaCreate, EstadoReserva } from "../../types/reserva";

const BASE = process.env.NEXT_PUBLIC_API_URL;

async function authFetch(path: string, init?: RequestInit) {
    const s = await getSession();
    const token = (s)?.accessToken;
    const headers = new Headers(init?.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");
    const res = await fetch(`${BASE}${path}`, { ...init, headers, credentials: "include" });
    if (!res.ok) throw new Error(await res.text());
    return res;
}

export async function crearReserva(dto: ReservaCreate): Promise<Reserva> {
    const r = await authFetch(`/reservas/crear`, { method: "POST", body: JSON.stringify(dto) });
    return r.json();
}

export async function cancelarReserva(id: number): Promise<void> {
    await authFetch(`/reservas/${id}/cancelar`, { method: "PUT" });
}

export async function obtenerReserva(id: number): Promise<Reserva> {
    const r = await authFetch(`/reservas/${id}/reserva`, { method: "GET" });
    return r.json();
}

export async function listarReservas(): Promise<Reserva[]> {
    const r = await authFetch(`/reservas/lista`, { method: "GET" });
    return r.json();
}
export async function listarPorUsuario(idUsuario: number): Promise<Reserva[]> {
    const r = await authFetch(`/reservas/lista/usuario/${idUsuario}`, { method: "GET" });
    return r.json();
}
export async function listarPorRecurso(idRecurso: number): Promise<Reserva[]> {
    const r = await authFetch(`/reservas/lista/recurso/${idRecurso}`, { method: "GET" });
    return r.json();
}
export async function listarPorEstado(estado: EstadoReserva): Promise<Reserva[]> {
    const r = await authFetch(`/reservas/lista/estado/${estado}`, { method: "GET" });
    return r.json();
}
export async function listarPorFecha(fechaISO: string): Promise<Reserva[]> {
    const r = await authFetch(`/reservas/lista/fecha/${fechaISO}`, { method: "GET" });
    return r.json();
}
export async function listarPorUsuarioYEstado(idUsuario: number, estado: EstadoReserva): Promise<Reserva[]> {
    const r = await authFetch(`/reservas/lista/usuario/${idUsuario}/estado/${estado}`, { method: "GET" });
    return r.json();
}
export async function reporteReservas(desde: string, hasta: string, estado?: EstadoReserva, idRecursos?: number[]) {
    const params = new URLSearchParams({ desde, hasta });
    if (estado) params.append("estado", estado);
    if (idRecursos?.length) idRecursos.forEach((id) => params.append("idRecursos", String(id)));
    const r = await authFetch(`/reservas/reportes?${params.toString()}`, { method: "GET" });
    return r.json() as Promise<Reserva[]>;
}