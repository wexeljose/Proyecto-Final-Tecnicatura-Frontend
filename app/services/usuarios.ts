export interface UsuarioCreateDTO {
    nombre1: string;
    nombre2?: string;
    apellido1: string;
    apellido2: string;
    fechaNac: string;
    correo: string;
    tipoDocumento: string;
    nroDocumento: string;
    calle: string;
    nroPuerta: string;
    apto?: string;
    contrasena: string;
    tipoUsuario: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 🟢 Registrar usuario
export async function registrarUsuario(data: UsuarioCreateDTO) {
    try {
        const response = await fetch(`${API_URL}/usuarios/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error ${response.status}: ${text}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error al registrar usuario:", error);
        throw error;
    }
}

// 🟡 Login
export async function loginUsuario(correo: string, contrasena: string) {
    try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo, contrasena }),
        });

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg || "Credenciales incorrectas");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error en login:", error);
        throw error;
    }
}

