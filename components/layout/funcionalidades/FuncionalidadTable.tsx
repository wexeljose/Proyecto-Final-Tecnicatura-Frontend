import { Funcionalidad } from "../../../types/funcionalidades";

interface Props {
    items: Funcionalidad[];
    onEdit: (item: Funcionalidad) => void;
    onBaja: (id: number) => void;
}

export default function FuncionalidadTable({ items, onEdit, onBaja }: Props) {
    return (
        <div className="overflow-x-auto border border-gray-200 rounded text-sm">
            <table className="w-full border-collapse bg-white">
                <thead>
                <tr>
                    <th className="px-2 py-2 bg-gray-50 text-left font-medium text-gray-600 border-b">Nombre</th>
                    <th className="px-2 py-2 bg-gray-50 text-left font-medium text-gray-600 border-b">Descripción</th>
                    <th className="px-2 py-2 bg-gray-50 text-left font-medium text-gray-600 border-b">Estado</th>
                    <th className="px-2 py-2 bg-gray-50 font-medium text-gray-600 border-b text-right">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {items.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-2 py-2 font-medium text-gray-900">{f.nombre}</td>
                        <td className="px-2 py-2 text-gray-700">{f.descFunc}</td>
                        <td className="px-2 py-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium
                  ${f.estado === "Activos" ? "bg-green-100 text-green-800" :
                    f.estado === "Inactivos" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"}`}>
                  {f.estado}
                </span>
                        </td>
                        <td className="px-2 py-2">
                            <div className="flex items-center gap-2 justify-end">
                                <button
                                    onClick={() => onEdit(f)}
                                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onBaja(f.id)}
                                    className="px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                                >
                                    Baja
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                {!items.length && (
                    <tr>
                        <td colSpan={4} className="px-2 py-8 text-center text-gray-500">Sin funcionalidades registradas</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}