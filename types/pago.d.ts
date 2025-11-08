export type FormaCobro = "Efectivo" | "Transferencia" | "Debito" | "Credito";

export interface Pago {
    id: number;
    montoCob: number;
    fecCobro: string;
    formaCobro: FormaCobro;
    esCuota: boolean;
    idUsuario: number;
    idRecurso?: number | null;
}

export interface PagoCreate {
    montoCob: number;
    fecCobro: string;
    formaCobro: FormaCobro;
    esCuota: boolean;
    idUsuario: number;
    idRecurso?: number | null;
}

export interface PagoUpdate {
    montoCob?: number;
    fecCobro?: string;
    formaCobro?: string;
    esCuota?: boolean;
    idRecurso?: number | null;
}
