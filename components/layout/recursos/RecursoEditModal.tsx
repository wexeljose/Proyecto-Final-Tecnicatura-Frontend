"use client";
import { useEffect, useState } from "react";
import { Recurso, Estado } from "../../../types/recurso";

interface RecursoForm {
    nombre: string;
    descRecurso: string;
    tarifaSocio: number;
    tarifaNosocio: number;
    capacidadMaxima: number;
    fechaPrecios: string;
    estado: Estado;
}

export default function RecursoEditModal({
                                             item,
                                             onClose,
                                             onSave,
                                         }: {
    item: Recurso | null;
    onClose: () => void;
    onSave: (
        id: number,
        dto: Partial<RecursoForm>
    ) => void;
}) {
    const [form, setForm] = useState<RecursoForm>({
        nombre: "",
        descRecurso: "",
        tarifaSocio: 0,
        tarifaNosocio: 0,
        capacidadMaxima: 0,
        fechaPrecios: "",
        estado: "Sin_validar",
    });

    useEffect(() => {
        if (item) {
            setForm({
                nombre: item.nombre,
                descRecurso: item.descRecurso,
                tarifaSocio: item.tarifaSocio,
                tarifaNosocio: item.tarifaNosocio,
                capacidadMaxima: item.capacidadMaxima,
                fechaPrecios: item.fechaPrecios,
                estado: item.estado as Estado,
            });
        }
    }, [item]);

    if (!item) return null;

    // 🔹 Tipado seguro del bind
    type FormKeys = keyof RecursoForm;
    const bind = (k: FormKeys) => ({
        value: form[k] ?? "",
        onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => setForm((s) => ({ ...s, [k]: e.target.value })),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(item.id, form);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-[560px]">
                <h2 className="text-lg font-bold mb-3">Editar recurso</h2>
                <form onSubmit={submit} className="grid grid-cols-2 gap-3">
                    <input className="border px-2 py-1.5 rounded col-span-2" placeholder="Nombre" {...bind("nombre")} />
                    <textarea className="border px-2 py-1.5 rounded col-span-2" placeholder="Descripción" {...bind("descRecurso")} />
                    <input className="border px-2 py-1.5 rounded" placeholder="Tarifa socio" type="number" step="0.01" {...bind("tarifaSocio")} />
                    <input className="border px-2 py-1.5 rounded" placeholder="Tarifa no socio" type="number" step="0.01" {...bind("tarifaNosocio")} />
                    <input className="border px-2 py-1.5 rounded" placeholder="Capacidad" type="number" min={1} {...bind("capacidadMaxima")} />
                    <input className="border px-2 py-1.5 rounded" placeholder="Vigencia precios" type="date" {...bind("fechaPrecios")} />
                    <select className="border px-2 py-1.5 rounded bg-white col-span-2" {...bind("estado")}>
                        <option value="Activos">Activos</option>
                        <option value="Inactivos">Inactivos</option>
                        <option value="Sin_validar">Sin validar</option>
                    </select>
                    <div className="col-span-2 flex justify-end gap-2 mt-1">
                        <button type="button" className="px-3 py-1 border rounded" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}