"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { getMisDatos, actualizarMisDatos } from "../../../app/services/usuarios";
import { Usuario, UpdateUsuario } from "../../../types/usuarios";
import { User, Mail, Calendar, Home, Lock, Hash } from "lucide-react";

type MisDatosForm = UpdateUsuario & { contrasena?: string };

interface Props {
    onClose: () => void;
}

export default function MisDatosModal({ onClose }: Props) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [form, setForm] = useState<Partial<MisDatosForm>>({});
    const [repetirContrasena, setRepetirContrasena] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 🔐 Validación de contraseña segura
    const validarContrasena = (password: string): boolean => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };

    // 🔵 Calcular edad
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

    // ---------------------------
    // Cargar datos del usuario
    // ---------------------------
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const actual = await getMisDatos();
                setUsuario(actual);

                setForm({
                    nombre1: actual.nombre1,
                    nombre2: actual.nombre2,
                    apellido1: actual.apellido1,
                    apellido2: actual.apellido2,
                    fechaNac: actual.fechaNac,
                    calle: actual.calle,
                    nroPuerta: actual.nroPuerta,
                    apto: actual.apto,
                });

            } catch {
                toast.error("Error al cargar tus datos ❌");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    // ---------------------------
    // Manejo de cambios
    // ---------------------------
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // ---------------------------
    // Guardar cambios
    // ---------------------------
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 🔵 Validar edad si se modifica
        if (form.fechaNac) {
            const edad = calcularEdad(form.fechaNac);
            if (edad < 18) {
                toast.error("Debes tener al menos 18 años ❌");
                return;
            }
        }

        if (form.contrasena) {
            if (!validarContrasena(form.contrasena)) {
                toast.error("La contraseña debe tener 8 caracteres, mayúsculas, minúsculas, número y símbolo ❌");
                return;
            }

            if (form.contrasena !== repetirContrasena) {
                toast.error("Las contraseñas no coinciden ❌");
                return;
            }
        }

        try {
            setSaving(true);
            await actualizarMisDatos(form as UpdateUsuario);

            toast.success("Datos actualizados correctamente ✅");
            onClose();

        } catch {
            toast.error("Error al actualizar tus datos ❌");
        } finally {
            setSaving(false);
        }
    };

    // ---------------------------
    // Loading
    // ---------------------------
    if (loading)
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-gray-600">
                    Cargando tus datos...
                </div>
            </div>
        );

    if (!usuario) return null;

    // ---------------------------
    // FORMULARIO COMPLETO
    // ---------------------------
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
                    Mis datos personales
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre y Apellidos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                name="nombre1"
                                value={form.nombre1 || ""}
                                onChange={handleChange}
                                placeholder="Primer nombre"
                                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="relative">
                            <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                name="nombre2"
                                value={form.nombre2 || ""}
                                onChange={handleChange}
                                placeholder="Segundo nombre (opcional)"
                                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                name="apellido1"
                                value={form.apellido1 || ""}
                                onChange={handleChange}
                                placeholder="Primer apellido"
                                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="relative">
                            <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                name="apellido2"
                                value={form.apellido2 || ""}
                                onChange={handleChange}
                                placeholder="Segundo apellido (opcional)"
                                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Dirección */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                            <Home className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                name="calle"
                                value={form.calle || ""}
                                onChange={handleChange}
                                placeholder="Calle"
                                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="relative">
                            <Home className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                name="nroPuerta"
                                value={form.nroPuerta || ""}
                                onChange={handleChange}
                                placeholder="Número de puerta"
                                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <Home className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            name="apto"
                            value={form.apto || ""}
                            onChange={handleChange}
                            placeholder="Apartamento (opcional)"
                            className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Fecha de nacimiento */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            name="fechaNac"
                            type="date"
                            value={form.fechaNac || ""}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Campos bloqueados */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                value={usuario.correo}
                                disabled
                                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 text-gray-500"
                            />
                        </div>

                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                value={`${usuario.tipoDocumento} ${usuario.nroDocumento}`}
                                disabled
                                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-100 text-gray-500"
                            />
                        </div>
                    </div>

                    <input
                        value={usuario.tipoUsuario}
                        disabled
                        className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500"
                    />

                    {/* Cambio de contraseña */}
                    <hr className="my-4" />
                    <h3 className="text-sm font-semibold text-blue-800">
                        Cambiar contraseña (opcional)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                name="contrasena"
                                type="password"
                                value={form.contrasena || ""}
                                onChange={handleChange}
                                placeholder="Nueva contraseña"
                                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="password"
                                value={repetirContrasena}
                                onChange={(e) => setRepetirContrasena(e.target.value)}
                                placeholder="Repetir contraseña"
                                className="w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 transition"
                            disabled={saving}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className={`px-4 py-2 text-white rounded-md transition ${
                                saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
                            }`}
                            disabled={saving}
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

