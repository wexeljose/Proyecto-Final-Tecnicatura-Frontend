export type Estado = "Activos" | "Inactivos" | "Sin_validar";

export interface Recurso {
    id: number;
    nombre: string;
    descRecurso: string;
    tarifaSocio: number;
    tarifaNosocio: number;
    capacidadMaxima: number;
    fechaPrecios: string;
    estado: string;
}

export interface RecursoCreate {
    nombre: string;
    descRecurso: string;
    tarifaSocio: number;
    tarifaNosocio: number;
    capacidadMaxima: number;
    fechaPrecios: string;
}

export interface RecursoUpdate {
    nombre?: string;
    descRecurso?: string;
    tarifaSocio?: number;
    tarifaNosocio?: number;
    capacidadMaxima?: number;
    fechaPrecios?: string;
    estado?: Estado;
}