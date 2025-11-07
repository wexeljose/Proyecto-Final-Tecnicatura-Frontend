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