"use client";
import { Usuario } from "../../../types/usuarios";
import { Edit, Trash2, CheckCircle } from "lucide-react";

interface Props {
    usuarios: Usuario[];
    onEditar: (usuario: Usuario) => void;
    onBaja: (id: number) => void;
    onActualizarEstado: (usuario: Usuario, nuevoEstado: string) => void;
}

export default function UsuarioTable({
                                         usuarios,
                                         onEditar,
                                         onBaja,
                                         onActualizarEstado,
                                     }: Props) {
    if (!usuarios || usuarios.length === 0) {
        return <p className="text-gray-500">No hay usuarios registrados.</p>;
    }

    const estadoDisplay = (estado: string) => {
        switch (estado) {
            case "Activos":
                return "Activo";
            case "Inactivos":
                return "Inactivo";
            case "Sin_validar":
                return "Sin validar";
            default:
                return estado;
        }
    };

    const colorEstado = (estado: string) => {
        switch (estado) {
            case "Activos":
                return "bg-green-100 text-green-700 border-green-400";
            case "Inactivos":
                return "bg-red-100 text-red-700 border-red-400";
            case "Sin_validar":
                return "bg-yellow-100 text-yellow-700 border-yellow-400";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    return (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm text-gray-800">
                <thead className="bg-blue-900 text-white uppercase text-xs">
                <tr>
                    <th className="px-3 py-2 text-left">Nombre completo</th>
                    <th className="px-3 py-2 text-left">Correo</th>
                    <th className="px-3 py-2 text-left">Documento</th>
                    <th className="px-3 py-2 text-left">Tipo usuario</th>
                    <th className="px-3 py-2 text-left">Estado</th>
                    <th className="px-3 py-2 text-left">Dirección</th>
                    <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
                </thead>

                <tbody>
                {usuarios.map((u) => (
                    <tr
                        key={u.id}
                        className="border-b hover:bg-gray-50 transition duration-100"
                    >
                        <td className="px-3 py-2">
                            {`${u.nombre1} ${u.nombre2 ?? ""} ${u.apellido1} ${
                                u.apellido2 ?? ""
                            }`.trim()}
                        </td>
                        <td className="px-3 py-2">{u.correo}</td>
                        <td className="px-3 py-2">{`${u.tipoDocumento} ${u.nroDocumento}`}</td>
                        <td className="capitalize">
                            {u.tipoUsuario === "NoSocio"
                                ? "No socio"
                                : u.tipoUsuario === "AuxiliarAdm"
                                    ? "A. Administrativo"
                                    : u.tipoUsuario === "Socio"
                                        ? "Socio"
                                        : u.tipoUsuario}
                        </td>

                        <td className="px-3 py-2">
                <span
                    className={`px-2 py-1 rounded-md border text-xs font-semibold whitespace-nowrap ${colorEstado(
                        u.estado
                    )}`}
                >
                  {estadoDisplay(u.estado)}
                </span>
                        </td>
                        <td className="px-3 py-2">
                            {`${u.calle} ${u.nroPuerta}${u.apto ? `, Apto ${u.apto}` : ""}`}
                        </td>
                        <td className="px-3 py-2 flex justify-center gap-2">
                            <button
                                onClick={() => onEditar(u)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Editar usuario"
                            >
                                <Edit size={18} />
                            </button>

                            {u.estado === "Activos" && (
                                <button
                                    onClick={() => onBaja(u.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Dar de baja"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}

                            {(u.estado === "Inactivos" || u.estado === "Sin_validar") && (
                                <button
                                    onClick={() => onActualizarEstado(u, "Activos")}
                                    className="text-green-600 hover:text-green-800"
                                    title={
                                        u.estado === "Inactivos"
                                            ? "Reactivar usuario"
                                            : "Validar usuario"
                                    }
                                >
                                    <CheckCircle size={18} />
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}


