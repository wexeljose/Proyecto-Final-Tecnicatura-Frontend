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

export async function buscarAuditorias(
    token: string,
    filtros: {
        nombreUsuario?: string;
        operacion?: string;
        seccion?: string;
        terminal?: string;
        fechaDesde?: string;
        fechaHasta?: string;
    }
): Promise<Auditoria[]> {
    const params = new URLSearchParams();

    if (filtros.nombreUsuario) params.append("nombreUsuario", filtros.nombreUsuario);
    if (filtros.operacion) params.append("operacion", filtros.operacion);
    if (filtros.seccion) params.append("seccion", filtros.seccion);
    if (filtros.terminal) params.append("terminal", filtros.terminal);
    if (filtros.fechaDesde) params.append("desde", filtros.fechaDesde);
    if (filtros.fechaHasta) params.append("hasta", filtros.fechaHasta);

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auditoria/buscar?${params.toString()}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    if (!res.ok) throw new Error("Error al buscar auditorías");
    return res.json();
}



