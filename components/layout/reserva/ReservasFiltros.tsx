"use client";
import type { EstadoReserva } from "../../../types/reserva";

type EstadoFiltro = "" | EstadoReserva;

export default function ReservasFiltros({
                                            estado, setEstado, fecha, setFecha, recurso, setRecurso, aplicar, onCrear,
                                        }: {
    estado: EstadoFiltro;
    setEstado: React.Dispatch<React.SetStateAction<EstadoFiltro>>;
    fecha: string; setFecha: (v: string) => void;
    recurso: string; setRecurso: (v: string) => void;
    aplicar: () => void;
    onCrear: () => void;
}) {
    const limpiar = () => { setEstado(""); setFecha(""); setRecurso(""); aplicar(); };
    return (
        <aside className="w-[260px] p-3 border rounded bg-white">
            <h2 className="font-medium text-sm pb-2 border-b">Filtros</h2>
            <div className="space-y-2 mt-2">
                <select className="w-full border rounded px-2 py-1.5 bg-white" value={estado}
                        onChange={(e) => setEstado(e.target.value as EstadoFiltro)}>
                    <option value="">Todos los estados</option>
                    <option value="Activos">Activos</option>
                    <option value="Inactivos">Inactivos</option>
                    <option value="Sin_validar">Sin validar</option>
                </select>
                <input type="date" className="w-full border rounded px-2 py-1.5" value={fecha} onChange={(e)=>setFecha(e.target.value)} />
                <input type="number" min={0} className="w-full border rounded px-2 py-1.5" placeholder="ID recurso"
                       value={recurso} onChange={(e)=>setRecurso(e.target.value)} />
            </div>
            <div className="flex gap-2 mt-3">
                <button onClick={aplicar} className="px-3 py-1 bg-blue-600 text-white rounded">Buscar</button>
                <button onClick={limpiar} className="px-3 py-1 border rounded">Limpiar</button>
            </div>
            <div className="mt-3">
                <button onClick={onCrear} className="px-3 py-1 bg-green-600 text-white rounded w-full">Nueva reserva</button>
            </div>
        </aside>
    );
}