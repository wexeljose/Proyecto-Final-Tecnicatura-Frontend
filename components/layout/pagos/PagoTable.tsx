import type { Pago } from "../../../types/pago";
import type { Usuario } from "../../../types/usuarios";
import type { Recurso } from "../../../types/recurso";
import type { Actividad } from "../../../types/actividad";

function nombreCorto(u: Usuario) {
    return `${u.nombre1} ${u.apellido1}`.trim();
}

export default function PagoTable({
                                      items,
                                      onEdit,
                                      usuarios,
                                      recursos,
                                      actividades,  // 👈 nuevo
                                  }: {
    items: Pago[];
    onEdit: (p: Pago) => void;
    usuarios?: Usuario[];
    recursos?: Recurso[];
    actividades?: Actividad[];  // 👈 nuevo
}) {
    const userName = (id: number) => {
        const u = usuarios?.find((x) => x.id === id);
        return u ? nombreCorto(u) : String(id);
    };

    const recursoNombre = (id?: number | null) => {
        if (!id) return null;
        const r = recursos?.find((x) => x.id === id);
        return r ? r.nombre : String(id);
    };

    const actividadNombre = (id?: number | null) => {
        if (!id) return null;
        const a = actividades?.find((x) => x.id === id);
        return a ? a.nombre : String(id);
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
                    <th className="px-2 py-2 text-left">Actividad</th> {/* 👈 NUEVA */}
                    <th className="px-2 py-2 text-right">Acciones</th>
                </tr>
                </thead>

                <tbody className="divide-y">
                {items.map((p) => {
                    const rec = recursoNombre(p.idRecurso);
                    const act = actividadNombre(p.idActividad);

                    return (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-2 py-2">{p.fecCobro}</td>
                            <td className="px-2 py-2">{p.montoCob.toFixed(2)}</td>
                            <td className="px-2 py-2">{p.formaCobro}</td>
                            <td className="px-2 py-2">{p.esCuota ? "Sí" : "No"}</td>
                            <td className="px-2 py-2">{userName(p.idUsuario)}</td>

                            {/* Recurso */}
                            <td className="px-2 py-2">{rec ?? "-"}</td>

                            {/* Actividad */}
                            <td className="px-2 py-2">{act ?? "-"}</td>

                            <td className="px-2 py-2 text-right">
                                <button
                                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded"
                                    onClick={() => onEdit(p)}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    );
                })}

                {!items.length && (
                    <tr>
                        <td colSpan={8} className="px-2 py-8 text-center text-gray-500">
                            Sin pagos
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}