"use client";
import { useState, useEffect } from "react";
import { Perfil, UpdatePerfil } from "../../../types/perfil";

interface Props {
  perfil: Perfil | null;
  onClose: () => void;
  onSave: (id: number, data: UpdatePerfil) => void;
}

export default function EditPerfilModal({ perfil, onClose, onSave }: Props) {
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("");

  // Inicializamos los campos cuando cambia el perfil
  useEffect(() => {
    if (perfil) {
      setDescripcion(perfil.descripcion);
      setEstado(perfil.estado);
    }
  }, [perfil]);

  if (!perfil) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(perfil.id, { descripcion, estado });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          {/* Nombre (no editable) */}
          <div>
            <label className="block font-semibold">Nombre</label>
            <input
              type="text"
              value={perfil.nombrePerfil}
              disabled
              className="w-full border px-2 py-1 rounded bg-gray-100"
            />
          </div>

          {/* Descripción (editable) */}
          <div>
            <label className="block font-semibold">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Estado (editable) */}
          <div>
            <label className="block font-semibold">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="Activos">Activos</option>
              <option value="Inactivos">Inactivos</option>
              <option value="Sin_validar">Sin validar</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
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
