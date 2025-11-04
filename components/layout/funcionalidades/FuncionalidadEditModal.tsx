"use client";
import { useEffect, useState } from "react";
import { Funcionalidad } from "../../../types/funcionalidades";
import {Estado} from "../../../types/funcionalidades";

interface Props {
    item: Funcionalidad | null;
    onClose: () => void;
    onSave: (id: number, data: { descFunc?: string; estado?: "Activos"|"Inactivos"|"Sin_validar" }) => void;
}

export default function FuncionalidadEditModal({ item, onClose, onSave }: Props) {
    const [descFunc, setDescFunc] = useState("");
    const [estado, setEstado] = useState<"Activos"|"Inactivos"|"Sin_validar">("Activos");

    useEffect(() => {
        if (item) {
            setDescFunc(item.descFunc);
            setEstado(item.estado);
        }
    }, [item]);

    if (!item) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(item.id, { descFunc, estado });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[480px]">
                <h2 className="text-lg font-bold mb-4">Editar Funcionalidad</h2>
                <form onSubmit={submit} className="flex flex-col gap-3">
                    <div>
                        <label className="block font-semibold text-sm">Nombre</label>
                        <input type="text" value={item.nombre} disabled className="w-full border px-2 py-1 rounded bg-gray-100" />
                    </div>
                    <div>
                        <label className="block font-semibold text-sm">Descripción</label>
                        <textarea value={descFunc} onChange={(e) => setDescFunc(e.target.value)} className="w-full border px-2 py-1 rounded" />
                    </div>
                    <div>
                        <label className="block font-semibold text-sm">Estado</label>
                        <select value={estado} onChange={(e) => setEstado(e.target.value as Estado)} className="w-full border px-2 py-1 rounded bg-white">
                            <option value="Activos">Activos</option>
                            <option value="Inactivos">Inactivos</option>
                            <option value="Sin_validar">Sin validar</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                        <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancelar</button>
                        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}