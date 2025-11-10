"use client";

import { useState } from "react";
import { crearTipoDeActividad } from "../../../app/services/tipoDeActividad";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
}

export default function ModalCrearTipoActividad({ onClose }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!nombre.trim() || !descripcion.trim()) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      await crearTipoDeActividad({
        nombre,
        descripcion,
      });

      toast.success("Tipo de actividad creado exitosamente ✅");

      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el tipo de actividad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Crear Tipo de Actividad
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre"
            className="border rounded px-3 py-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <textarea
            placeholder="Descripción"
            className="border rounded px-3 py-2"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            onClick={handleGuardar}
            disabled={loading}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
