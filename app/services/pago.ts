import { getSession } from "next-auth/react";
import type { Pago, PagoCreate, PagoUpdate, FormaCobro } from "../../types/pago";

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

export async function crearPago(dto: PagoCreate): Promise<Pago> {
    const r = await authFetch(`/pagos/crear`, { method: "POST", body: JSON.stringify(dto) });
    return r.json();
}

export async function modificarPago(id: number, dto: PagoUpdate): Promise<Pago> {
    const r = await authFetch(`/pagos/${id}/modificar`, { method: "PUT", body: JSON.stringify(dto) });
    return r.json();
}

export async function listarPorUsuario(idUsuario: number): Promise<Pago[]> {
    const r = await authFetch(`/pagos/lista/usuario?idUsuario=${idUsuario}`, { method: "GET" });
    return r.json();
}

export async function listarPorFormaCobro(formaCobro: FormaCobro | string): Promise<Pago[]> {
    const r = await authFetch(`/pagos/lista/formacobro?formaCobro=${encodeURIComponent(formaCobro)}`, { method: "GET" });
    return r.json();
}

export async function listarPorEsCuota(esCuota: boolean): Promise<Pago[]> {
    const r = await authFetch(`/pagos/lista/cuota?esCuota=${esCuota}`, { method: "GET" });
    return r.json();
}

export async function listarPorFechas(desde: string, hasta: string): Promise<Pago[]> {
    const r = await authFetch(`/pagos/lista/fechas/inicio/${desde}/fin/${hasta}`, { method: "GET" });
    return r.json();
}

export async function reportePagos(params: {
    idUsuario?: number;
    formaCobro?: string;
    esCuota?: boolean;
    desde?: string;
    hasta?: string;
}): Promise<Pago[]> {
    const q = new URLSearchParams();
    if (params.idUsuario != null) q.append("idUsuario", String(params.idUsuario));
    if (params.formaCobro) q.append("formaCobro", params.formaCobro);
    if (params.esCuota != null) q.append("esCuota", String(params.esCuota));
    if (params.desde) q.append("desde", params.desde);
    if (params.hasta) q.append("hasta", params.hasta);
    const r = await authFetch(`/pagos/reportes?${q.toString()}`, { method: "GET" });
    return r.json();
}