// types/inscripcion.ts

export interface InscripcionActividad {
  id: number;
  idUsuario: number;
  idActividad: number;
  fecInscripcion: string; // LocalDate en formato ISO
  cancelada: boolean;
}

export interface CreateInscripcion {
  idUsuario: number;
  idActividad: number;
}

// Extendemos Actividad para incluir información de inscripción del usuario
export interface ActividadConInscripcion {
  id: number;
  nombre: string;
  descripcion: string;
  objetivo: string;
  fechaAct: string; // LocalDate en formato ISO
  horaAct: string; // LocalTime en formato HH:mm:ss
  duracion: string; // LocalTime en formato HH:mm:ss
  costoTicket: number;
  requiereInscripcion: boolean;
  fechaAperturaInscripcion: string; // LocalDate en formato ISO
  formaPago?: string | null;
  observaciones?: string | null;
  estado: string;
  idRecurso: number;
  idTipoActividad: number;
  
  // Campos adicionales para la UI
  inscrito?: boolean;
  idInscripcion?: number;
  fechaInscripcion?: string;
}

export interface FiltrosInscripcion {
  nombre: string;
  tipoActividad: string;
  fechaDesde: string;
  fechaHasta: string;
  costoMin: string;
  costoMax: string;
  estado: string;
}

export interface InscripcionReporteRow {
  id: number;
  actividadNombre: string;
  usuarioEmail: string;
  fecInscripcion: string;
  estado: "INSCRIPCION" | "CANCELACION";
}

export interface FiltroReporteInscripciones {
  fechaDesde?: string;
  fechaHasta?: string;
  cancelada?: boolean;       // true = canceladas, false = inscripciones, undefined = ambas
  actividades?: number[];    // lista de ids seleccionados
}

export interface InscripcionActividadReporte {
  id: number;
  idUsuario: number;
  emailUsuario: string;
  idActividad: number;
  nombreActividad: string;
  fecInscripcion: string; // ISO date
  cancelada: boolean;
}

// types/inscripcion.ts

export interface InscripcionActividad {
  id: number;
  idUsuario: number;
  idActividad: number;
  fecInscripcion: string; // LocalDate en formato ISO
  cancelada: boolean;
}

export interface CreateInscripcion {
  idUsuario: number;
  idActividad: number;
}

// Extendemos Actividad para incluir información de inscripción del usuario
export interface ActividadConInscripcion {
  id: number;
  nombre: string;
  descripcion: string;
  objetivo: string;
  fechaAct: string; // LocalDate en formato ISO
  horaAct: string; // LocalTime en formato HH:mm:ss
  duracion: string; // LocalTime en formato HH:mm:ss
  costoTicket: number;
  requiereInscripcion: boolean;
  fechaAperturaInscripcion: string; // LocalDate en formato ISO
  formaPago?: string | null;
  observaciones?: string | null;
  estado: string;
  idRecurso: number;
  idTipoActividad: number;
  
  // Campos adicionales para la UI
  inscrito?: boolean;
  idInscripcion?: number;
  fechaInscripcion?: string;
}

export interface FiltrosInscripcion {
  nombre: string;
  tipoActividad: string;
  fechaDesde: string;
  fechaHasta: string;
  costoMin: string;
  costoMax: string;
  estado: string;
}