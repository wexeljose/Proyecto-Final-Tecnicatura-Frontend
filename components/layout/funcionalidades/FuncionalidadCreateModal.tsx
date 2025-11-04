"use client";
import { useState } from "react";

interface Props {
    onClose: () => void;
    onCrear: (data: { nombre: string; descFunc: string }) => void;
}

export default function FuncionalidadCreateModal({ onClose, onCrear }: Props) {
    const [nombre, setNombre] = useState("");
    const [descFunc, setDescFunc] = useState("");

    const submit = () => {
        if (!nombre.trim() || !descFunc.trim()) return;
        onCrear({ nombre, descFunc });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-[480px]">
                <h2 className="text-lg font-bold mb-4">Crear Funcionalidad</h2>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <textarea
                    placeholder="Descripción"
                    value={descFunc}
                    onChange={(e) => setDescFunc(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 border rounded" onClick={onClose}>Cancelar</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={submit}>Crear</button>
                </div>
            </div>
        </div>
    );
}