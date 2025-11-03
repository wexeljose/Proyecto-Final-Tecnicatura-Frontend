export interface Perfil {
  id: number;
  nombrePerfil: string;
  descripcion: string;
  estado: string;
}
export interface UpdatePerfil {
    descripcion?: string;
    estado?: string;
}
