"use client";
import { useEffect, useState } from "react";
import { Funcionalidad } from "../../../types/funcionalidades";
import { Estado } from "../../../types/funcionalidades";

interface Props {
    item: Funcionalidad | null;
    onClose: () => void;
    onSave: (
        id: number,
        data: { descFunc?: string; estado?: "Activos" | "Inactivos" | "Sin_validar" }
    ) => void | Promise<void>;
}

type Errors = {
    descFunc?: string;
};

export default function FuncionalidadEditModal({ item, onClose, onSave }: Props) {
    const [descFunc, setDescFunc] = useState("");
    const [estado, setEstado] = useState<"Activos" | "Inactivos" | "Sin_validar">(
        "Activos"
    );
    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (item) {
            setDescFunc(item.descFunc);
            setEstado(item.estado);
            setErrors({});
        }
    }, [item]);

    if (!item) return null;

    const validarDescripcion = (value: string): string | undefined => {
        const t = value.trim();
        const allowedPattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,:;()/_-]+$/;

        if (!t) return "La descripción es obligatoria.";
        if (t.length > 100) return "La descripción no debe superar los 100 caracteres.";
        if (!allowedPattern.test(t)) return "El campo contiene caracteres no permitidos.";

        return undefined;
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errorDesc = validarDescripcion(descFunc);
        if (errorDesc) {
            setErrors({ descFunc: errorDesc });
            return;
        }

        setSaving(true);
        try {
            await onSave(item.id, { descFunc, estado });
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[480px]">
                <h2 className="text-lg font-bold mb-4">Editar Funcionalidad</h2>
                <form onSubmit={submit} className="flex flex-col gap-3">
                    <div>
                        <label className="block font-semibold text-sm">Nombre</label>
                        <input
                            type="text"
                            value={item.nombre}
                            disabled
                            className="w-full border px-2 py-1 rounded bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold text-sm">Descripción</label>
                        <textarea
                            value={descFunc}
                            onChange={(e) => {
                                setDescFunc(e.target.value);
                                if (errors.descFunc) {
                                    const err = validarDescripcion(e.target.value);
                                    setErrors({ descFunc: err });
                                }
                            }}
                            onBlur={() => {
                                const err = validarDescripcion(descFunc);
                                setErrors({ descFunc: err });
                            }}
                            aria-invalid={!!errors.descFunc}
                            aria-describedby="err-desc-edit"
                            className={`w-full border px-2 py-1 rounded min-h-24 ${
                                errors.descFunc ? "border-red-500" : ""
                            }`}
                        />
                        {errors.descFunc && (
                            <p
                                id="err-desc-edit"
                                className="text-red-600 text-sm mt-1"
                                role="alert"
                            >
                                {errors.descFunc}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold text-sm">Estado</label>
                        <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value as Estado)}
                            className="w-full border px-2 py-1 rounded bg-white"
                        >
                            <option value="Activos">Activos</option>
                            <option value="Inactivos">Inactivos</option>
                            <option value="Sin_validar">Sin validar</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1 border rounded"
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                            disabled={saving}
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
