export interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  objetivo: string;
  fechaAct: string;
  horaAct: string;
  duracion: string;
  costoTicket: number;
  requiereInscripcion: boolean;
  fechaAperturaInscripcion: string;
  formaPago: string;
  observaciones?: string;
  estado: string;
  idRecurso: number;
  idTipoActividad: number;
  recursoNombre?: string;
  tipoActividadNombre?: string;
}

export interface CreateActividad {
  nombre: string;
  descripcion: string;
  objetivo: string;
  fechaAct: string;
  horaAct: string;
  duracion: string;
  costoTicket: number;
  requiereInscripcion: boolean;
  fechaAperturaInscripcion: string;
  formaPago: string;
  observaciones?: string;
  idRecurso: number;
  idTipoActividad: number;
}

export interface UpdateActividad {
  descripcion?: string;
  objetivo?: string;
  fechaAct?: string;
  horaAct?: string;
  duracion?: string;
  costoTicket?: number;
  formaPago?: string;
  observaciones?: string;
  estado?: string;
}
