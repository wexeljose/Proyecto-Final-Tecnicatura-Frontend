
// ========================
// 🧩 Estructura general de Usuario
// ========================

export interface Usuario {
    id: number;
    nombre1: string;
    nombre2?: string;
    apellido1: string;
    apellido2?: string;
    fechaNac?: string;
    correo: string;
    tipoDocumento: string;
    nroDocumento: string;
    calle: string;
    nroPuerta: string;
    apto?: string;
    tipoUsuario: "Socio" | "NoSocio" | "AuxiliarAdm";
    estado: "Activos" | "Inactivos" | "Sin_validar";
    idPerfil?: number;
    socioDatos?: SocioDatos | null;
}

// ========================
// 🧩 Datos adicionales del socio
// ========================

export interface SocioDatos {
    lengSen: boolean;
    difAudi: boolean;
    pagoCuotas: boolean;
}

// ========================
// 🧩 Datos para actualización (desde modal)
// ========================

export interface UpdateUsuario {
    nombre1: string;
    nombre2?: string;
    apellido1: string;
    apellido2?: string;
    fechaNac?: string;
    calle: string;
    nroPuerta: string;
    apto?: string;
    tipoUsuario: "Socio" | "NoSocio" | "AuxiliarAdm";
    estado: string;
    idPerfil: number;
    socioDatos?: SocioDatos | null;
}

// ========================
// 🧩 Datos para creación de usuario
// ========================

export interface CreateUsuario {
    nombre1: string;
    nombre2?: string;
    apellido1: string;
    apellido2?: string;
    fechaNac: string;
    correo: string;
    tipoDocumento: string;
    nroDocumento: string;
    calle: string;
    nroPuerta: string;
    apto?: string;
    contrasena: string;
    tipoUsuario: "Socio" | "NoSocio" | "AuxiliarAdm";
    socioDatos?: SocioDatos | null;
}