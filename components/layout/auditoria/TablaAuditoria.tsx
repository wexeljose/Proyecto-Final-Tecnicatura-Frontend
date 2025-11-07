"use client";
import { Auditoria } from "../../../types/auditoria";

interface Props {
    datos: Auditoria[];
}

export default function TablaAuditoria({ datos }: Props) {
    if (!datos || datos.length === 0) {
        return <p className="text-gray-500">No hay registros de auditoría.</p>;
    }

    return (
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm text-gray-800">
                <thead className="bg-blue-900 text-white uppercase text-xs">
                <tr>
                    <th className="px-3 py-2 text-left">Fecha</th>
                    <th className="px-3 py-2 text-left">Usuario</th>
                    <th className="px-3 py-2 text-left">Operación</th>
                    <th className="px-3 py-2 text-left">Sección</th>
                    <th className="px-3 py-2 text-left">Terminal</th>
                </tr>
                </thead>
                <tbody>
                {datos.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-gray-50 transition duration-100">
                        <td className="px-3 py-2">{a.fecha.replace("T", " ").slice(0, 16)}</td>
                        <td className="px-3 py-2">{a.nombreUsuario ?? `#${a.idUsuario ?? "-"}`}</td>
                        <td className="px-3 py-2">{a.operacion}</td>
                        <td className="px-3 py-2">{a.seccion}</td>
                        <td className="px-3 py-2">{a.terminal}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
