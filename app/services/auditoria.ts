import { Auditoria } from "../../types/auditoria";

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number; // página actual
    size: number;
}

export async function listarAuditorias(
    token: string,
    page = 0,
    size = 50
): Promise<PageResponse<Auditoria>> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auditoria/lista?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error al listar auditorías");
    return res.json();
}



