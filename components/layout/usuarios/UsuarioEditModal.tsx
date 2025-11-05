"use client";
import { useState, useEffect } from "react";
import { Usuario, UpdateUsuario } from "../../../types/usuarios";

interface Props {
    usuario: Usuario | null;
    onClose: () => void;
    onSave: (id: number, data: UpdateUsuario) => void;
}

export default function EditUsuarioModal({ usuario, onClose, onSave }: Props) {
    const [form, setForm] = useState<UpdateUsuario>({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        fechaNac: "",
        calle: "",
        nroPuerta: "",
        apto: "",
        tipoUsuario: "",
        estado: "",
        idPerfil: 0,
        socioDatos: null,
    });

    useEffect(() => {
        if (usuario) {
            setForm({
                nombre1: usuario.nombre1 || "",
                nombre2: usuario.nombre2 || "",
                apellido1: usuario.apellido1 || "",
                apellido2: usuario.apellido2 || "",
                fechaNac: usuario.fechaNac || "",
                calle: usuario.calle || "",
                nroPuerta: usuario.nroPuerta || "",
                apto: usuario.apto || "",
                tipoUsuario: usuario.tipoUsuario,
                estado: usuario.estado,
                idPerfil: usuario.idPerfil || 0,
                socioDatos: usuario.socioDatos || null,
            });
        }
    }, [usuario]);

    if (!usuario) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSocioCheck = (name: string, checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            socioDatos: { ...prev.socioDatos, [name]: checked },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(usuario.id, form);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-blue-900">
                    Editar Usuario
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Datos personales */}
                    <div className="grid grid-cols-2 gap-3">
                        <input name="nombre1" value={form.nombre1} onChange={handleChange} className="border rounded px-2 py-1" placeholder="Primer nombre" required />
                        <input name="nombre2" value={form.nombre2} onChange={handleChange} className="border rounded px-2 py-1" placeholder="Segundo nombre (opcional)" />
                        <input name="apellido1" value={form.apellido1} onChange={handleChange} className="border rounded px-2 py-1" placeholder="Primer apellido" required />
                        <input name="apellido2" value={form.apellido2} onChange={handleChange} className="border rounded px-2 py-1" placeholder="Segundo apellido (opcional)" />
                    </div>

                    <input type="date" name="fechaNac" value={form.fechaNac} onChange={handleChange} className="border rounded w-full px-2 py-1" />

                    {/* Documento (solo lectura) */}
                    <input value={`${usuario.tipoDocumento} ${usuario.nroDocumento}`} disabled className="border rounded w-full px-2 py-1 bg-gray-100 text-gray-500" />

                    {/* Correo (solo lectura) */}
                    <input value={usuario.correo} disabled className="border rounded w-full px-2 py-1 bg-gray-100 text-gray-500" />

                    {/* Dirección */}
                    <div className="grid grid-cols-2 gap-3">
                        <input name="calle" value={form.calle} onChange={handleChange} className="border rounded px-2 py-1" placeholder="Calle" />
                        <input name="nroPuerta" value={form.nroPuerta} onChange={handleChange} className="border rounded px-2 py-1" placeholder="Nro. Puerta" />
                    </div>
                    <input name="apto" value={form.apto} onChange={handleChange} className="border rounded w-full px-2 py-1" placeholder="Apartamento (opcional)" />

                    {/* Tipo de usuario y estado */}
                    <div className="grid grid-cols-2 gap-3">
                        <select name="tipoUsuario" value={form.tipoUsuario} onChange={handleChange} className="border rounded px-2 py-1">
                            <option value="Socio">Socio</option>
                            <option value="NoSocio">No Socio</option>
                            <option value="AuxiliarAdm">Auxiliar Administrativo</option>
                        </select>

                        <select name="estado" value={form.estado} onChange={handleChange} className="border rounded px-2 py-1">
                            <option value="Activos">Activo</option>
                            <option value="Inactivos">Inactivo</option>
                            <option value="Sin_validar">Sin validar</option>
                        </select>
                    </div>

                    {/* Perfil */}
                    <input
                        type="number"
                        name="idPerfil"
                        value={form.idPerfil}
                        onChange={handleChange}
                        className="border rounded w-full px-2 py-1"
                        placeholder="ID de Perfil"
                    />

                    {/* Datos del socio */}
                    {form.tipoUsuario === "Socio" && (
                        <div className="border rounded p-3 mt-2 bg-blue-50">
                            <p className="font-semibold text-sm text-blue-900 mb-1">
                                Datos del Socio
                            </p>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.socioDatos?.lengSeñas || false}
                                    onChange={(e) => handleSocioCheck("lengSeñas", e.target.checked)}
                                />
                                Usa lengua de señas
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.socioDatos?.difAudi || false}
                                    onChange={(e) => handleSocioCheck("difAudi", e.target.checked)}
                                />
                                Tiene dificultad auditiva
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.socioDatos?.pagoCuotas || false}
                                    onChange={(e) => handleSocioCheck("pagoCuotas", e.target.checked)}
                                />
                                Está al día con cuotas
                            </label>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex justify-end gap-2 pt-3">
                        <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
                            Cancelar
                        </button>
                        <button type="submit" className="px-3 py-1 bg-blue-900 text-white rounded hover:bg-blue-800">
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


