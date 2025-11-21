"use client";

import { useEffect, useState } from "react";
import type { Pago, PagoUpdate } from "../../../types/pago";
import type { Recurso } from "../../../types/recurso";
import type { Actividad } from "../../../types/actividad";

export default function PagoEditModal({
                                          item,
                                          onClose,
                                          onSave,
                                          recursos,
                                          actividades,  // 👈 nuevo
                                      }: {
    item: Pago | null;
    onClose: () => void;
    onSave: (id: number, dto: PagoUpdate) => void;
    recursos: Recurso[];
    actividades: Actividad[]; // 👈 nuevo
}) {
    const [form, setForm] = useState<PagoUpdate>({});

    useEffect(() => {
        if (item) {
            setForm({
                montoCob: item.montoCob,
                fecCobro: item.fecCobro,
                formaCobro: item.formaCobro,
                esCuota: item.esCuota,
                idRecurso: item.idRecurso ?? undefined,
                idActividad: item.idActividad ?? undefined,  // 👈 nuevo
            });
        }
    }, [item]);

    if (!item) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const esCuota = !!form.esCuota;

        // Normalizamos: 0 => undefined
        const idRecurso = form.idRecurso && form.idRecurso !== 0 ? form.idRecurso : undefined;
        const idActividad = form.idActividad && form.idActividad !== 0 ? form.idActividad : undefined;

        if (!esCuota) {
            const recursoSeleccionado = idRecurso !== undefined;
            const actividadSeleccionada = idActividad !== undefined;

            if (!recursoSeleccionado && !actividadSeleccionada) {
                alert("Debes seleccionar un recurso O una actividad.");
                return;
            }

            if (recursoSeleccionado && actividadSeleccionada) {
                alert("No puedes seleccionar recurso y actividad al mismo tiempo.");
                return;
            }
        }

        onSave(item.id, {
            ...form,
            idRecurso,
            idActividad,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-[560px] shadow">
                <h2 className="text-lg font-bold mb-3">Editar pago</h2>
                <form onSubmit={submit} className="grid grid-cols-2 gap-3 text-sm">

                    <label>
                        <span className="block mb-1 font-medium">Monto</span>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full border rounded px-2 py-1.5"
                            value={form.montoCob ?? ""}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    montoCob: Number(e.target.value),
                                }))
                            }
                        />
                    </label>

                    <label>
                        <span className="block mb-1 font-medium">Fecha cobro</span>
                        <input
                            type="date"
                            className="w-full border rounded px-2 py-1.5"
                            value={form.fecCobro ?? ""}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    fecCobro: e.target.value,
                                }))
                            }
                        />
                    </label>

                    <label className="col-span-2">
                        <span className="block mb-1 font-medium">Forma cobro</span>
                        <input
                            className="w-full border rounded px-2 py-1.5"
                            maxLength={30}
                            value={form.formaCobro ?? ""}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    formaCobro: e.target.value,
                                }))
                            }
                        />
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!form.esCuota}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setForm((s) => ({
                                    ...s,
                                    esCuota: checked,
                                    idRecurso: checked ? undefined : s.idRecurso,
                                    idActividad: checked ? undefined : s.idActividad,
                                }));
                            }}
                        />
                        <span>Es cuota</span>
                    </label>

                    <label className="col-span-2">
                        <span className="block mb-1 font-medium">Recurso</span>
                        <select
                            className="w-full border rounded px-2 py-1.5 bg-white"
                            value={form.idRecurso ?? 0}
                            disabled={form.esCuota}
                            onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                setForm((s) => ({
                                    ...s,
                                    idRecurso: value || undefined,
                                    idActividad: value ? undefined : s.idActividad,
                                }));
                            }}
                        >
                            <option value={0}>Sin recurso</option>
                            {recursos.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="col-span-2">
                        <span className="block mb-1 font-medium">Actividad</span>
                        <select
                            className="w-full border rounded px-2 py-1.5 bg-white"
                            value={form.idActividad ?? 0}
                            disabled={form.esCuota}
                            onChange={(e) => {
                                const value = Number(e.target.value) || 0;
                                setForm((s) => ({
                                    ...s,
                                    idActividad: value || undefined,
                                    idRecurso: value ? undefined : s.idRecurso,
                                }));
                            }}
                        >
                            <option value={0}>Sin actividad</option>
                            {actividades.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.nombre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="col-span-2 flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            className="px-3 py-1 border rounded"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}