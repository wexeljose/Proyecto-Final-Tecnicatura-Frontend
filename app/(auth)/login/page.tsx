"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            redirect: false,
            username: correo,
            password: contrasena,
        });

        if (res?.error) {
            setError("Correo o contraseña incorrectos");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            {/* Contenedor principal dividido en dos columnas */}
            <div className="flex flex-col md:flex-row flex-grow">
                {/* Imagen lateral */}
                <div className="relative md:w-1/2 h-64 md:h-auto">
                    <Image
                        src="/carousel1.jpg"
                        alt="Imagen institucional ASUR"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-blue-900/40"></div>
                </div>

                {/* Formulario */}
                <div className="flex items-center justify-center md:w-1/2 px-6 py-12">
                    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/asur-logo.png"
                                alt="Logo ASUR"
                                className="h-20 w-auto"
                            />
                        </div>

                        <h2 className="text-center text-2xl font-bold mb-6 text-blue-800">
                            Iniciar sesión
                        </h2>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-2.5 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-2.5 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-center text-red-500 text-sm font-medium">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition font-medium"
                            >
                                Iniciar sesión
                            </button>
                        </form>

                        <div className="mt-6 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">o</span>
                        </div>

                        <button
                            onClick={() => signIn("google")}
                            className="mt-4 w-full border border-gray-300 bg-white py-2 rounded-md hover:bg-gray-100 transition flex items-center justify-center gap-2"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            <span className="text-gray-700 font-medium">
                Iniciar sesión con Google
              </span>
                        </button>

                        <div className="text-center mt-4">
                            <a href="#" className="text-sm text-blue-700 hover:underline">
                                ¿Olvidó su contraseña?
                            </a>
                        </div>

                        <div className="text-center mt-4 border-t pt-4">
                            <p className="text-sm text-gray-600">
                                ¿No tenés cuenta?{" "}
                                <Link
                                    href="/register"
                                    className="text-blue-700 hover:underline font-medium"
                                >
                                    Registrate ahora
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer institucional (solo en la página principal) */}
            <footer className="w-full bg-blue-900 text-white py-4 shadow-inner">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-center md:text-left">
                    <p className="text-xs">
                        © {new Date().getFullYear()} Asociación de Sordos del Uruguay — Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-blue-200 mt-1 md:mt-0">
                        Desarrollado por el equipo de proyecto MAVATECH – UTEC.
                    </p>
                </div>
            </footer>
        </main>
    );
}



