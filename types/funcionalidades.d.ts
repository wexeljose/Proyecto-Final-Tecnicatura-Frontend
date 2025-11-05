export type Estado = "Activos" | "Inactivos" | "Sin_validar";

export interface Funcionalidad {
    id: number;
    nombre: string;
    descFunc: string;
    estado: Estado;
}

export interface FuncionalidadCreate {
    nombre: string;
    descFunc: string;
}

export interface FuncionalidadUpdate {
    descFunc?: string;
    estado?: Estado;
}

export interface PerfilFuncionalidadDTO {
    id: number;
    idPerfil: number;
    idFuncionalidad: number;
    estado: Estado; // "Activos" | "Inactivos" | "Sin_validar"
}

export interface PerfilFuncionalidadCreateDTO {
    idPerfil: number;
    idFuncionalidad: number;
}