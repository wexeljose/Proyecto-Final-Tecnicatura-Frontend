"use client";
import type { FormaCobro } from "../../../types/pago";

type SetStr = (v: string) => void;

export default function PagoFiltros({
                                        idUsuario, setIdUsuario, formaCobro, setFormaCobro,
                                        esCuota, setEsCuota, desde, setDesde, hasta, setHasta,
                                        aplicar, onCrear,
                                    }: {
    idUsuario: string; setIdUsuario: SetStr;
    formaCobro: string; setFormaCobro: SetStr;
    esCuota: string; setEsCuota: SetStr; // "", "true", "false"
    desde: string; setDesde: SetStr;
    hasta: string; setHasta: SetStr;
    aplicar: () => void;
    onCrear: () => void;
}) {
    const limpiar = () => { setIdUsuario(""); setFormaCobro(""); setEsCuota(""); setDesde(""); setHasta(""); aplicar(); };

    return (
        <aside className="w-[260px] p-3 border rounded bg-white">
            <h2 className="font-medium text-sm pb-2 border-b">Filtros</h2>
            <div className="space-y-2 mt-2">
                <input className="w-full border px-2 py-1.5 rounded" placeholder="ID Usuario"
                       value={idUsuario} onChange={(e)=>setIdUsuario(e.target.value)} />
                <select className="w-full border px-2 py-1.5 rounded bg-white"
                        value={formaCobro} onChange={(e)=>setFormaCobro(e.target.value)}>
                    <option value="">Todas las formas</option>
                    {["Efectivo","Transferencia","Debito","Credito"].map(f=>(
                        <option key={f} value={f as FormaCobro}>{f}</option>
                    ))}
                </select>
                <select className="w-full border px-2 py-1.5 rounded bg-white"
                        value={esCuota} onChange={(e)=>setEsCuota(e.target.value)}>
                    <option value="">Cuota y No cuota</option>
                    <option value="true">Solo cuotas</option>
                    <option value="false">Solo no cuotas</option>
                </select>
                <input type="date" className="w-full border px-2 py-1.5 rounded" value={desde} onChange={(e)=>setDesde(e.target.value)} />
                <input type="date" className="w-full border px-2 py-1.5 rounded" value={hasta} onChange={(e)=>setHasta(e.target.value)} />
            </div>
            <div className="flex gap-2 mt-3">
                <button onClick={aplicar} className="px-3 py-1 bg-blue-600 text-white rounded">Buscar</button>
                <button onClick={limpiar} className="px-3 py-1 border rounded">Limpiar</button>
            </div>
            <div className="mt-3">
                <button onClick={onCrear} className="px-3 py-1 bg-green-600 text-white rounded w-full">Registrar pago</button>
            </div>
        </aside>
    );
}