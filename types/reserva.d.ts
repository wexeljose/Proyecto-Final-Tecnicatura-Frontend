export type EstadoReserva = "Activos" | "Inactivos" | "Sin_validar";

export interface Reserva {
    id: number;
    fechaRes: string;
    horaRes: string;
    duracion: string;
    cantPersonas: number;
    impAbonar: number;
    fechaVtoSenia: string;
    impSeniaPagar: number;
    fechaPagSenia: string;
    impSeniaPagado: number;
    saldoPendiente: number;
    estado: EstadoReserva;
    idUsuario: number;
    idRecurso: number;
}

export interface ReservaCreate {
    fechaRes: string;
    horaRes: string;
    duracion: string;
    cantPersonas: number;
    impAbonar: number;
    fechaPagSenia: string;
    impSeniaPagar: number;
    impSeniaPagado: number;
    saldoPendiente: number;
    idUsuario: number;
    idRecurso: number;
}
