"use client";
import { useState } from "react";

export default function RecursoCreateModal({
                                               onClose, onCrear,
                                           }: { onClose:()=>void; onCrear:(data:{
        nombre:string; descRecurso:string; tarifaSocio:number; tarifaNosocio:number; capacidadMaxima:number; fechaPrecios:string;
    })=>void }) {
    const [form, setForm] = useState({ nombre:"", descRecurso:"", tarifaSocio:"", tarifaNosocio:"", capacidadMaxima:"", fechaPrecios:"" });

    const submit = () => {
        if (!form.nombre.trim() || !form.descRecurso.trim() || !form.fechaPrecios) return;
        onCrear({
            nombre: form.nombre,
            descRecurso: form.descRecurso,
            tarifaSocio: Number(form.tarifaSocio),
            tarifaNosocio: Number(form.tarifaNosocio),
            capacidadMaxima: Number(form.capacidadMaxima),
            fechaPrecios: form.fechaPrecios,
        });
    };

    type FormKeys = keyof typeof form;
    const bind = (k: FormKeys) => ({
        value: form[k as FormKeys] ?? "",
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((s) => ({ ...s, [k]: e.target.value })),
    });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-[520px]">
                <h2 className="text-lg font-bold mb-3">Crear recurso</h2>
                <div className="grid grid-cols-2 gap-3">
                    <input className="border px-2 py-1.5 rounded col-span-2" placeholder="Nombre" {...bind("nombre")} />
                    <textarea className="border px-2 py-1.5 rounded col-span-2" placeholder="Descripción" {...bind("descRecurso")} />
                    <input className="border px-2 py-1.5 rounded" placeholder="Tarifa socio" type="number" step="0.01" {...bind("tarifaSocio")} />
                    <input className="border px-2 py-1.5 rounded" placeholder="Tarifa no socio" type="number" step="0.01" {...bind("tarifaNosocio")} />
                    <input className="border px-2 py-1.5 rounded" placeholder="Capacidad" type="number" min={1} {...bind("capacidadMaxima")} />
                    <input className="border px-2 py-1.5 rounded" placeholder="Vigencia precios" type="date" {...bind("fechaPrecios")} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button className="px-3 py-1 border rounded" onClick={onClose}>Cancelar</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={submit}>Crear</button>
                </div>
            </div>
        </div>
    );
}