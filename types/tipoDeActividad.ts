// src/types/tipoActividad.ts

export interface TipoActividad {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
}

export interface CreateTipoActividad {
  nombre: string;
  descripcion: string;
}

export interface TipoActividadBajaDTO {
  fechaBaja: string;         
  usuarioBaja: string;
  razonBaja: string;
  comentariosBaja?: string;
}