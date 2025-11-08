"use client";
import { useEffect, useMemo, useState } from "react";
import type { PagoCreate, FormaCobro } from "../../../types/pago";
import type { Recurso } from "../../../types/recurso";
import type { Usuario } from "../../../types/usuarios";

export function nombreCorto(u: Usuario) {
    return `${u.nombre1} ${u.apellido1}`.trim();
}

export default function PagoCreateModal({
                                            onClose, onCrear, recursos, usuarios, idUsuarioActual,
                                        }: {
    onClose: () => void;
    onCrear: (dto: PagoCreate) => void;
    recursos: Recurso[];
    usuarios: Usuario[];          // 👈 viene de tu servicio
    idUsuarioActual: number;
}) {
    // Si el usuario actual no está en activos, seleccionamos el primero activo
    const defaultUserId = useMemo(() => {
        return usuarios.find(u => u.id === idUsuarioActual)?.id ?? (usuarios[0]?.id ?? 0);
    }, [usuarios, idUsuarioActual]);

    const [form, setForm] = useState<PagoCreate>({
        montoCob: 0,
        fecCobro: "",
        formaCobro: "Efectivo",
        esCuota: false,
        idUsuario: defaultUserId,
        idRecurso: null,
    });

    useEffect(() => {
        setForm(s => ({ ...s, idUsuario: defaultUserId }));
    }, [defaultUserId]);

    const bind = <K extends keyof PagoCreate>(k: K) => ({
        value: (form[k] ?? "") as string | number | readonly string[],
        checked: typeof form[k] === "boolean" ? (form[k] as boolean) : undefined,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const target = e.target;

            let newValue: unknown;
            if (target instanceof HTMLInputElement && target.type === "checkbox") {
                newValue = target.checked;
            } else if (target instanceof HTMLInputElement && target.type === "number") {
                newValue = Number(target.value);
            } else {
                newValue = target.value;
            }

            setForm((s) => ({
                ...s,
                [k]: newValue as PagoCreate[K],
            }));
        },
    });

    const submit = () => {
        if (!form.fecCobro || form.montoCob <= 0 || !form.idUsuario) return;
        onCrear(form);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-[560px] shadow">
                <h2 className="text-lg font-bold mb-3">Registrar pago</h2>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <label className="col-span-2">
                        <span className="block mb-1 font-medium">Usuario</span>
                        <select
                            className="w-full border rounded px-2 py-1.5 bg-white"
                            value={form.idUsuario}
                            onChange={(e) => setForm(s => ({ ...s, idUsuario: Number(e.target.value) }))}
                        >
                            {usuarios.map(u => (
                                <option key={u.id} value={u.id}>
                                    {nombreCorto(u)} — {u.correo}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Monto</span>
                        <input type="number" step="0.01" className="w-full border rounded px-2 py-1.5" {...bind("montoCob")} />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Fecha cobro</span>
                        <input type="date" className="w-full border rounded px-2 py-1.5" {...bind("fecCobro")} />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Forma cobro</span>
                        <select className="w-full border rounded px-2 py-1.5 bg-white" {...bind("formaCobro")}>
                            {(["Efectivo","Transferencia","Debito","Credito"] as FormaCobro[]).map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </label>

                    <label className="flex items-center gap-2">
                        <input type="checkbox" {...bind("esCuota")} />
                        <span>Es cuota</span>
                    </label>

                    <label className="col-span-2">
                        <span className="block mb-1 font-medium">Recurso (opcional)</span>
                        <select
                            className="w-full border rounded px-2 py-1.5 bg-white"
                            value={form.idRecurso ?? 0}
                            onChange={(e) => setForm(s => ({ ...s, idRecurso: Number(e.target.value) || null }))}
                        >
                            <option value={0}>Sin recurso</option>
                            {recursos.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                        </select>
                    </label>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-3 py-1 border rounded" onClick={onClose}>Cancelar</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>Registrar</button>
                </div>
            </div>
        </div>
    );
}