"use client";
import { useState } from "react";

interface Props {
    onClose: () => void;
    onCrear: (data: { nombre: string; descFunc: string }) => void | Promise<void>;
}

type Errors = {
    nombre?: string;
    descFunc?: string;
};

export default function FuncionalidadCreateModal({ onClose, onCrear }: Props) {
    const [nombre, setNombre] = useState("");
    const [descFunc, setDescFunc] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const [sending, setSending] = useState(false);

    const validar = (values: { nombre: string; descFunc: string }): Errors => {
        const e: Errors = {};
        const nombreTrim = values.nombre.trim();
        const descTrim = values.descFunc.trim();

        // misma lógica que en el back, pero en TS
        const allowedPattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,:;()/_-]+$/;

        // Nombre
        if (!nombreTrim) {
            e.nombre = "El nombre es obligatorio.";
        } else if (nombreTrim.length > 50) {
            e.nombre = "El nombre no debe superar los 50 caracteres.";
        } else if (!allowedPattern.test(nombreTrim)) {
            e.nombre = "El campo contiene caracteres no permitidos.";
        }

        // Descripción
        if (!descTrim) {
            e.descFunc = "La descripción es obligatoria.";
        } else if (descTrim.length > 100) {
            e.descFunc = "La descripción no debe superar los 100 caracteres.";
        } else if (!allowedPattern.test(descTrim)) {
            e.descFunc = "El campo contiene caracteres no permitidos.";
        }

        return e;
    };

    const submit = async () => {
        // Validación en cliente
        const validationErrors = validar({ nombre, descFunc });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSending(true);
        try {
            // Normalizamos solo el nombre, no tocamos la descripción
            await onCrear({
                nombre: nombre.trim(),
                descFunc: descFunc,
            });
            onClose();
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-[480px]">
                <h2 className="text-lg font-bold mb-4">Crear Funcionalidad</h2>

                {/* Nombre */}
                <label className="block font-semibold text-sm">Nombre</label>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => {
                        setNombre(e.target.value);
                        if (errors.nombre) {
                            // si el usuario corrige, revalidamos solo este campo
                            const eSolo = validar({ nombre: e.target.value, descFunc });
                            setErrors((prev) => ({ ...prev, nombre: eSolo.nombre }));
                        }
                    }}
                    onBlur={() => {
                        const eSolo = validar({ nombre, descFunc });
                        setErrors((prev) => ({ ...prev, nombre: eSolo.nombre }));
                    }}
                    aria-invalid={!!errors.nombre}
                    aria-describedby="err-nombre"
                    className={`border p-2 rounded w-full mb-1 ${
                        errors.nombre ? "border-red-500" : ""
                    }`}
                />
                {errors.nombre && (
                    <p id="err-nombre" className="text-red-600 text-sm mb-2" role="alert">
                        {errors.nombre}
                    </p>
                )}

                {/* Descripción */}
                <label className="block font-semibold text-sm">Descripción</label>
                <textarea
                    placeholder="Descripción"
                    value={descFunc}
                    onChange={(e) => {
                        setDescFunc(e.target.value);
                        if (errors.descFunc) {
                            const eSolo = validar({ nombre, descFunc: e.target.value });
                            setErrors((prev) => ({ ...prev, descFunc: eSolo.descFunc }));
                        }
                    }}
                    onBlur={() => {
                        const eSolo = validar({ nombre, descFunc });
                        setErrors((prev) => ({ ...prev, descFunc: eSolo.descFunc }));
                    }}
                    aria-invalid={!!errors.descFunc}
                    aria-describedby="err-desc"
                    className={`border p-2 rounded w-full mb-1 min-h-24 ${
                        errors.descFunc ? "border-red-500" : ""
                    }`}
                />
                {errors.descFunc && (
                    <p id="err-desc" className="text-red-600 text-sm mb-2" role="alert">
                        {errors.descFunc}
                    </p>
                )}

                <div className="flex justify-end gap-2 mt-2">
                    <button
                        className="px-4 py-2 border rounded"
                        onClick={onClose}
                        disabled={sending}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                        onClick={submit}
                        disabled={sending}
                    >
                        {sending ? "Creando..." : "Crear"}
                    </button>
                </div>
            </div>
        </div>
    );
}