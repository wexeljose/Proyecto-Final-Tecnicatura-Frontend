"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  onClose: () => void;
  onCrear: (data: { nombrePerfil: string; descripcion: string }) => void;
}

export default function CrearPerfilModal({ onClose, onCrear }: Props) {
  const [nombrePerfil, setNombrePerfil] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = () => {
    if (!nombrePerfil.trim() || !descripcion.trim()) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (confirm(`¿Deseas crear el perfil "${nombrePerfil}"?`)) {
      onCrear({ nombrePerfil, descripcion });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[400px]">
        <h2 className="text-lg font-bold mb-4">Crear Perfil</h2>
        <input
          type="text"
          placeholder="Nombre del perfil"
          value={nombrePerfil}
          onChange={(e) => setNombrePerfil(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
