"use client";
import { useEffect, useState } from "react";
import type { Recurso } from "../../../types/recurso";
import type { ReservaCreate } from "../../../types/reserva";

interface Props {
    onClose: () => void;
    onCrear: (dto: ReservaCreate) => void;
    recursos: Recurso[];             // activos para seleccionar
    idUsuarioActual: number;         // lo pedís al auth o lo pasás fijo (el BE igual lo pisa)
}

export default function ReservaCreateModal({ onClose, onCrear, recursos, idUsuarioActual }: Props) {
    const [form, setForm] = useState<ReservaCreate>({
        fechaRes: "", horaRes: "", duracion: "01:00",
        cantPersonas: 1, impAbonar: 0, fechaPagSenia: "", impSeniaPagar: 0, impSeniaPagado: 0, saldoPendiente: 0,
        idUsuario: idUsuarioActual, idRecurso: 0,
    });

    useEffect(() => {
        setForm((s) => ({ ...s, idUsuario: idUsuarioActual }));
    }, [idUsuarioActual]);

    const bind = (k: keyof ReservaCreate) => ({
        value: (form)[k] ?? "",
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setForm((s) => ({ ...s, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value })),
    });

    const submit = () => {
        if (!form.fechaRes || !form.horaRes || !form.fechaPagSenia || !form.idRecurso) return;
        onCrear(form);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-[680px] shadow">
                <h2 className="text-lg font-bold mb-3">Nueva reserva</h2>

                <div className="grid grid-cols-3 gap-3 text-sm">
                    <label className="col-span-2">
                        <span className="block mb-1 font-medium">Recurso</span>
                        <select className="w-full border rounded px-2 py-1.5 bg-white" {...bind("idRecurso")}>
                            <option value={0}>Seleccionar…</option>
                            {recursos.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                        </select>
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Fecha</span>
                        <input type="date" className="w-full border rounded px-2 py-1.5" {...bind("fechaRes")} />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Hora</span>
                        <input type="time" className="w-full border rounded px-2 py-1.5" {...bind("horaRes")} />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Duración</span>
                        <input type="time" className="w-full border rounded px-2 py-1.5" {...bind("duracion")} />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Personas</span>
                        <input type="number" min={1} className="w-full border rounded px-2 py-1.5" {...bind("cantPersonas")} />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Importe total</span>
                        <input type="number" step="0.01" className="w-full border rounded px-2 py-1.5" {...bind("impAbonar")} />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Fecha pago seña</span>
                        <input type="date" className="w-full border rounded px-2 py-1.5" {...bind("fechaPagSenia")} />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Seña a pagar</span>
                        <input type="number" step="0.01" className="w-full border rounded px-2 py-1.5" {...bind("impSeniaPagar")} />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Seña pagada</span>
                        <input type="number" step="0.01" className="w-full border rounded px-2 py-1.5" {...bind("impSeniaPagado")} />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Saldo pendiente</span>
                        <input type="number" step="0.01" className="w-full border rounded px-2 py-1.5" {...bind("saldoPendiente")} />
                    </label>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-3 py-1 border rounded" onClick={onClose}>Cancelar</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>Crear</button>
                </div>
            </div>
        </div>
    );
}