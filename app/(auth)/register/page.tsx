"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Calendar, Home, Hash } from "lucide-react";
import { crearUsuario } from "../../services/usuarios";

// Tipado del usuario a enviar al backend
interface UsuarioRequest {
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
    socioDatos?: {
        lengSen: boolean;
        difAudi: boolean;
        pagoCuotas: boolean;
    };
}

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        fechaNac: "",
        correo: "",
        tipoDocumento: "",
        nroDocumento: "",
        calle: "",
        nroPuerta: "",
        apto: "",
        contrasena: "",
        repetirContrasena: "",
        tipoUsuario: "",
    });

    const [socioDatos, setSocioDatos] = useState({
        lengSen: false,
        difAudi: false,
        pagoCuotas: false,
    });

    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const validarContrasena = (password: string): boolean => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };

    const calcularEdad = (fechaNac: string): number => {
        const hoy = new Date();
        const cumple = new Date(fechaNac);
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const mes = hoy.getMonth() - cumple.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < cumple.getDate())) {
            edad--;
        }
        return edad;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSocioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSocioDatos({...socioDatos, [e.target.name]: e.target.checked});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        if (form.contrasena !== form.repetirContrasena) {
            setError("Las contraseñas no coinciden");
            return;
        }

        const edad = calcularEdad(form.fechaNac);
        if (edad < 18) {
            setError("Debes tener al menos 18 años para registrarte.");
            return;
        }

        if (!validarContrasena(form.contrasena)) {
            setError(
                "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, un número y un carácter especial."
            );
            return;
        }

        if (!aceptaTerminos) {
            setError("Debes aceptar los términos y condiciones");
            return;
        }

        const data: UsuarioRequest = {
            nombre1: form.nombre1,
            nombre2: form.nombre2 || undefined,
            apellido1: form.apellido1,
            apellido2: form.apellido2 || undefined,
            fechaNac: form.fechaNac,
            correo: form.correo,
            tipoDocumento: form.tipoDocumento,
            nroDocumento: form.nroDocumento,
            calle: form.calle,
            nroPuerta: form.nroPuerta,
            apto: form.apto || undefined,
            contrasena: form.contrasena,
            tipoUsuario: form.tipoUsuario,
        };

        if (form.tipoUsuario === "Socio") {
            data.socioDatos = {
                lengSen: socioDatos.lengSen,
                difAudi: socioDatos.difAudi,
                pagoCuotas: socioDatos.pagoCuotas,
            };
        }

        try {
            await crearUsuario(data);
            setMensaje("✅ Usuario registrado correctamente. Debe esperar a que su cuenta sea activada por un Administrador.");
            setTimeout(() => router.push("/"), 4000);

        } catch (err) {
            console.error("Error al registrar:", err);

            let mensajeError = "Error al registrar el usuario";

            // Obtener mensaje válido si existe
            if (err instanceof Error && err.message) {
                mensajeError = err.message;
            }

            // Intentar parsear si viene como JSON
            try {
                const parsed = JSON.parse(mensajeError);
                if (parsed && typeof parsed === "object" && "error" in parsed) {
                    mensajeError = parsed.error;
                }
            } catch {
                // No era JSON — continuar sin errores
            }

            // Normalizar mensajes comunes
            const normalizado = mensajeError.toLowerCase();

            if (normalizado.includes("correo") || normalizado.includes("email")) {
                mensajeError = "Este correo ya está registrado. Por favor, utilizá otro.";
            }

            if (
                normalizado.includes("documento") ||
                normalizado.includes("cédula") ||
                normalizado.includes("ci")
            ) {
                mensajeError = "Este documento ya está registrado en el sistema.";
            }

            setError(mensajeError);
        }
    };


    return (
        <main className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <div className="flex flex-col md:flex-row flex-grow">
                {/* Imagen lateral */}
                <div className="relative md:w-1/2 h-64 md:h-auto">
                    <Image
                        src="/carousel2.jpg"
                        alt="Registro ASUR"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-blue-900/40"></div>
                </div>

                {/* Formulario */}
                <div className="flex items-center justify-center md:w-1/2 px-6 py-12">
                    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg border border-gray-100">
                        <div className="flex justify-center mb-6">
                            <img src="/asur-logo.png" alt="Logo ASUR" className="h-20 w-auto"/>
                        </div>

                        <h2 className="text-center text-2xl font-bold mb-6 text-blue-800">
                            Crear cuenta
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Nombres y apellidos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        name="nombre1"
                                        placeholder="Primer nombre"
                                        value={form.nombre1}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        name="nombre2"
                                        placeholder="Segundo nombre (opcional)"
                                        value={form.nombre2}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        name="apellido1"
                                        placeholder="Primer apellido"
                                        value={form.apellido1}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        name="apellido2"
                                        placeholder="Segundo apellido"
                                        value={form.apellido2}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Fecha de nacimiento y correo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        type="date"
                                        name="fechaNac"
                                        value={form.fechaNac}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        type="email"
                                        name="correo"
                                        placeholder="Correo electrónico"
                                        value={form.correo}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Documento */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <select
                                        name="tipoDocumento"
                                        value={form.tipoDocumento}
                                        onChange={handleChange}
                                        className="w-full py-2 px-3 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                                        required
                                    >
                                        <option value="">Tipo de documento</option>
                                        <option value="CI">Cédula</option>
                                        <option value="Pasaporte">Pasaporte</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        name="nroDocumento"
                                        placeholder="Número de documento"
                                        value={form.nroDocumento}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Domicilio */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="relative">
                                    <Home className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        name="calle"
                                        placeholder="Calle"
                                        value={form.calle}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Home className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        name="nroPuerta"
                                        placeholder="Número de puerta"
                                        value={form.nroPuerta}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <Home className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                <input
                                    name="apto"
                                    placeholder="Apartamento (opcional)"
                                    value={form.apto}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                />
                            </div>

                            {/* Contraseñas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        type="password"
                                        name="contrasena"
                                        placeholder="Contraseña"
                                        value={form.contrasena}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                    <input
                                        type="password"
                                        name="repetirContrasena"
                                        placeholder="Repetir contraseña"
                                        value={form.repetirContrasena}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Tipo de usuario */}
                            <select
                                name="tipoUsuario"
                                value={form.tipoUsuario}
                                onChange={handleChange}
                                className="w-full py-2 px-3 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                                required
                            >
                                <option value="">Seleccionar tipo de usuario</option>
                                <option value="Socio">Socio</option>
                                <option value="NoSocio">No Socio</option>
                                <option value="AuxiliarAdm">Auxiliar Administrativo</option>
                            </select>

                            {/* Campos adicionales si es Socio */}
                            {form.tipoUsuario === "Socio" && (
                                <div className="mt-3 border-t pt-3">
                                    <h4 className="font-semibold text-sm mb-2 text-blue-900">Datos de socio</h4>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="lengSen"
                                                checked={socioDatos.lengSen}
                                                onChange={handleSocioChange}
                                            />
                                            Usa lengua de señas
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="difAudi"
                                                checked={socioDatos.difAudi}
                                                onChange={handleSocioChange}
                                            />
                                            Presenta dificultad auditiva
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="pagoCuotas"
                                                checked={socioDatos.pagoCuotas}
                                                onChange={handleSocioChange}
                                            />
                                            Está al día con el pago de cuotas
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Términos */}
                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={aceptaTerminos}
                                    onChange={() => setAceptaTerminos(!aceptaTerminos)}
                                    className="mr-2"
                                    id="terminos"
                                />
                                <label htmlFor="terminos" className="text-sm text-gray-600">
                                    Acepto los{" "}
                                    <Link href="/terminos" className="text-blue-700 hover:underline">
                                        términos y condiciones
                                    </Link>
                                </label>
                            </div>

                            {/* Mensajes */}
                            {error && <p className="text-center text-red-500 text-sm font-medium mt-2">{error}</p>}
                            {mensaje && (
                                <div
                                    className="mt-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded-md text-center animate-fadeIn">
                                    {mensaje}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!aceptaTerminos}
                                className={`w-full py-2 rounded-md font-medium mt-2 transition ${
                                    aceptaTerminos
                                        ? "bg-blue-900 text-white hover:bg-blue-800 cursor-pointer"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                Registrarse
                            </button>
                        </form>

                        <div className="text-center mt-4 border-t pt-4">
                            <p className="text-sm text-gray-600">
                                ¿Ya tenés cuenta?{" "}
                                <Link href="/login" className="text-blue-700 hover:underline font-medium">
                                    Iniciar sesión
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="w-full bg-blue-900 text-white py-4 shadow-inner">
                <div
                    className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-center md:text-left">
                    <p className="text-xs">
                        © {new Date().getFullYear()} Asociación de Sordos del Uruguay — Todos los derechos
                        reservados.
                    </p>
                    <p className="text-xs text-blue-200 mt-1 md:mt-0">
                        Desarrollado por el equipo de proyecto MAVATECH – UTEC.
                    </p>
                </div>
            </footer>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out;
                }
            `}</style>
        </main>
    );
}






