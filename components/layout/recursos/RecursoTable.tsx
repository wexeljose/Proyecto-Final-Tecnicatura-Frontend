import { Recurso } from "../../../types/recurso";

export default function RecursoTable({
                                         items, onEdit, onBaja,
                                     }: { items: Recurso[]; onEdit: (r: Recurso)=>void; onBaja: (id:number)=>void; }) {
    return (
        <div className="overflow-x-auto border border-gray-200 rounded text-sm bg-white">
            <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-2 py-2 text-left">Nombre</th>
                    <th className="px-2 py-2 text-left">Descripción</th>
                    <th className="px-2 py-2 text-left">Capacidad</th>
                    <th className="px-2 py-2 text-left">Socio</th>
                    <th className="px-2 py-2 text-left">No socio</th>
                    <th className="px-2 py-2 text-left">Vigencia</th>
                    <th className="px-2 py-2 text-left">Estado</th>
                    <th className="px-2 py-2 text-right">Acciones</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {items.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-2 py-2 font-medium">{r.nombre}</td>
                        <td className="px-2 py-2">{r.descRecurso}</td>
                        <td className="px-2 py-2">{r.capacidadMaxima}</td>
                        <td className="px-2 py-2">{Number(r.tarifaSocio).toFixed(2)}</td>
                        <td className="px-2 py-2">{Number(r.tarifaNosocio).toFixed(2)}</td>
                        <td className="px-2 py-2">{r.fechaPrecios}</td>
                        <td className="px-2 py-2">
                <span className={`px-2 py-0.5 rounded ${
                    r.estado==="Activos" ? "bg-green-100 text-green-700" :
                        r.estado==="Inactivos" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800"
                }`}>{r.estado}</span>
                        </td>
                        <td className="px-2 py-2 text-right">
                            <div className="inline-flex gap-2">
                                <button className="px-2 py-1 bg-blue-50 text-blue-700 rounded" onClick={()=>onEdit(r)}>Editar</button>
                                <button className="px-2 py-1 bg-red-50 text-red-700 rounded" onClick={()=>onBaja(r.id)}>Baja</button>
                            </div>
                        </td>
                    </tr>
                ))}
                {!items.length && (
                    <tr><td colSpan={8} className="px-2 py-8 text-center text-gray-500">Sin recursos</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}