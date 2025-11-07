import type { Reserva } from "../../../types/reserva";

export default function ReservaTable({
                                         data, onCancel,
                                     }: { data: Reserva[]; onCancel: (id: number) => void }) {
    return (
        <div className="overflow-x-auto border rounded bg-white text-sm">
            <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-2 py-2 text-left">Recurso</th>
                    <th className="px-2 py-2 text-left">Fecha</th>
                    <th className="px-2 py-2 text-left">Hora</th>
                    <th className="px-2 py-2 text-left">Duración</th>
                    <th className="px-2 py-2 text-left">Personas</th>
                    <th className="px-2 py-2 text-left">Total</th>
                    <th className="px-2 py-2 text-left">Estado</th>
                    <th className="px-2 py-2 text-right">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {data.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-2 py-2">{r.idRecurso}</td>
                        <td className="px-2 py-2">{r.fechaRes}</td>
                        <td className="px-2 py-2">{r.horaRes}</td>
                        <td className="px-2 py-2">{r.duracion}</td>
                        <td className="px-2 py-2">{r.cantPersonas}</td>
                        <td className="px-2 py-2">{r.impAbonar.toFixed(2)}</td>
                        <td className="px-2 py-2">
                <span className={`px-2 py-0.5 rounded ${
                    r.estado==="Activos" ? "bg-green-100 text-green-700" :
                        r.estado==="Inactivos" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800"
                }`}>{r.estado}</span>
                        </td>
                        <td className="px-2 py-2 text-right">
                            <button onClick={() => onCancel(r.id)} className="px-2 py-1 bg-red-50 text-red-700 rounded">
                                Cancelar
                            </button>
                        </td>
                    </tr>
                ))}
                {!data.length && (
                    <tr><td colSpan={8} className="px-2 py-8 text-center text-gray-500">Sin reservas</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}