import { getSession } from "next-auth/react";
import { UpdateUsuario } from "../../types/usuarios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 🔹 Obtener lista de usuarios
 */
export async function obtenerUsuarios() {
    const session = await getSession();
    const token = session?.accessToken;

    const response = await fetch(`${API_URL}/usuarios/lista`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al obtener usuarios: ${text}`);
    }

    return response.json();
}

/**
 * 🔹 Crear usuario
 */
export async function crearUsuario(data: {
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
    tipoUsuario: string;
}) {
    const session = await getSession();
    const token = session?.accessToken;

    const response = await fetch(`${API_URL}/usuarios/registro`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al registrar usuario: ${text}`);
    }

    return response.json();
}

/**
 * 🔹 Dar de baja (baja lógica)
 */
export async function bajaUsuario(id: number) {
    const session = await getSession();
    const token = session?.accessToken;

    const response = await fetch(`${API_URL}/usuarios/${id}/baja`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al dar de baja usuario: ${text}`);
    }

    return true;
}

/**
 * 🔹 Actualizar usuario (modificación o reactivación)
 */
export async function actualizarUsuario(id: number, data: UpdateUsuario) {
    const session = await getSession();
    const token = session?.accessToken;

    // 🔸 Si el tipoUsuario es "Socio", incluimos socioDatos.
    // Si no, lo dejamos explícitamente en null para limpiar datos de socios antiguos.
    const payload = {
        ...data,
        socioDatos: data.tipoUsuario === "Socio" ? data.socioDatos : null,
    };

    const response = await fetch(`${API_URL}/usuarios/${id}/modificar`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al actualizar usuario: ${text}`);
    }

    return response.json();
}


/**
 * 🔹 Actualizar datos propios
 */
export async function actualizarMisDatos(datos: UpdateUsuario) {
    const session = await getSession();
    const token = session?.accessToken;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/mis-datos`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al actualizar tus datos: ${errorText}`);
    }

    return await res.json();
}

/**
 * 🔹 Obtener mis datos (usuario actual)
 */
export async function getMisDatos() {
    const session = await getSession();
    const token = session?.accessToken;

    const res = await fetch(`${API_URL}/usuarios/mis-datos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error al obtener mis datos: ${text}`);
    }

    return res.json();
}


