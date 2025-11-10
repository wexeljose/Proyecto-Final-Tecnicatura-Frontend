export interface Auditoria {
    id: number;
    fecha: string;         // ISO
    operacion: string;
    seccion: string;
    terminal: string;
    nombreUsuario: string;
    idUsuario: number | null; // 👈 viene del back
}

export interface FiltrosAuditoria {
    nombreUsuario: string;     // texto para permitir parcial
    operacion: string;
    seccion: string;
    fechaDesde: string;    // texto libre (ej: "2025-06-27")
    fechaHasta: string;    // texto libre
    terminal: string;
}

