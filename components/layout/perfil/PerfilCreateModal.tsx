// CrearPerfilModal.tsx - VERSIÓN SIMPLE
"use client";
import { useState } from "react";

interface Props {
  onClose: () => void;
  onCrear: (data: { nombrePerfil: string; descripcion: string }) => void;
}

interface ValidationErrors {
  nombrePerfil?: string;
  descripcion?: string;
}

export default function CrearPerfilModal({ onClose, onCrear }: Props) {
  const [nombrePerfil, setNombrePerfil] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const MIN_NOMBRE_LENGTH = 3;
  const MIN_DESCRIPCION_LENGTH = 3;
  const MAX_NOMBRE_LENGTH = 50;
  const MAX_DESCRIPCION_LENGTH = 120;

  const validar = (): boolean => {
    const nuevosErrores: ValidationErrors = {};

    if (!nombrePerfil.trim()) {
      nuevosErrores.nombrePerfil = "El nombre del perfil es obligatorio";
    } else if (nombrePerfil.trim().length < MIN_NOMBRE_LENGTH) {
      nuevosErrores.nombrePerfil = `Mínimo ${MIN_NOMBRE_LENGTH} caracteres`;
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria";
    } else if (descripcion.trim().length < MIN_DESCRIPCION_LENGTH) {
      nuevosErrores.descripcion = `Mínimo ${MIN_DESCRIPCION_LENGTH} caracteres`;
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) {
      return;
    }

    if (confirm(`¿Deseas crear el perfil "${nombrePerfil}"?`)) {
      onCrear({ 
        nombrePerfil: nombrePerfil.trim(), 
        descripcion: descripcion.trim() 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[400px]">
        <h2 className="text-lg font-bold mb-4">Crear Perfil</h2>

        {/* Nombre del perfil */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nombre del perfil</label>
          <input
            type="text"
            placeholder="Nombre del perfil (mín. 3 caracteres)"
            value={nombrePerfil}
            onChange={(e) => {
              setNombrePerfil(e.target.value);
              setErrors(prev => ({ ...prev, nombrePerfil: undefined }));
            }}
            maxLength={MAX_NOMBRE_LENGTH}
            className={`border p-2 rounded w-full ${
              errors.nombrePerfil ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.nombrePerfil && (
            <p className="text-red-600 text-xs mt-1">{errors.nombrePerfil}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {nombrePerfil.length}/{MAX_NOMBRE_LENGTH}
          </p>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            placeholder="Descripción (mín. 3 caracteres)"
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value);
              setErrors(prev => ({ ...prev, descripcion: undefined }));
            }}
            maxLength={MAX_DESCRIPCION_LENGTH}
            className={`border p-2 rounded w-full h-24 resize-none ${
              errors.descripcion ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.descripcion && (
            <p className="text-red-600 text-xs mt-1">{errors.descripcion}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {descripcion.length}/{MAX_DESCRIPCION_LENGTH}
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={
              nombrePerfil.trim().length < MIN_NOMBRE_LENGTH || 
              descripcion.trim().length < MIN_DESCRIPCION_LENGTH
            }
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}