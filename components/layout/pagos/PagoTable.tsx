import type { Pago } from "../../../types/pago";
import type { Usuario } from "../../../types/usuarios";
import type { Recurso } from "../../../types/recurso";

function nombreCorto(u: Usuario) {
    return `${u.nombre1} ${u.apellido1}`.trim();
}

export default function PagoTable({
                                      items,
                                      onEdit,
                                      usuarios,
                                      recursos,
                                  }: {
    items: Pago[];
    onEdit: (p: Pago) => void;
    usuarios?: Usuario[];  // ← ahora opcionales
    recursos?: Recurso[];  // ← ahora opcionales
}) {
    const userName = (id: number) => {
        const u = usuarios?.find((x) => x.id === id);
        return u ? nombreCorto(u) : String(id);
    };

    const recursoNombre = (id?: number | null) => {
        if (!id) return "-";
        const r = recursos?.find((x) => x.id === id);
        return r ? r.nombre : String(id);
        // si tu tipo no tiene "nombre", adapta la propiedad mostrada
    };

    return (
        <div className="overflow-x-auto border rounded bg-white text-sm">
            <table className="w-full">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-2 py-2 text-left">Fecha</th>
                    <th className="px-2 py-2 text-left">Monto</th>
                    <th className="px-2 py-2 text-left">Forma</th>
                    <th className="px-2 py-2 text-left">Cuota</th>
                    <th className="px-2 py-2 text-left">Usuario</th>
                    <th className="px-2 py-2 text-left">Recurso</th>
                    <th className="px-2 py-2 text-right">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {items.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-2 py-2">{p.fecCobro}</td>
                        <td className="px-2 py-2">{p.montoCob.toFixed(2)}</td>
                        <td className="px-2 py-2">{p.formaCobro}</td>
                        <td className="px-2 py-2">{p.esCuota ? "Sí" : "No"}</td>
                        <td className="px-2 py-2">{userName(p.idUsuario)}</td>
                        <td className="px-2 py-2">{recursoNombre(p.idRecurso)}</td>
                        <td className="px-2 py-2 text-right">
                            <button
                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded"
                                onClick={() => onEdit(p)}
                            >
                                Editar
                            </button>
                        </td>
                    </tr>
                ))}
                {!items.length && (
                    <tr>
                        <td colSpan={7} className="px-2 py-8 text-center text-gray-500">
                            Sin pagos
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}