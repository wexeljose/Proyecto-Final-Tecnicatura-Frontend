"use client";

import { useState } from "react";
import { TipoActividad, TipoActividadBajaDTO } from "../../../types/tipoDeActividad";
import { darDeBajaTipoDeActividad } from "../../../app/services/tipoDeActividad";
import toast from "react-hot-toast";

interface Props {
  tipoActividad: TipoActividad;
  onClose: () => void;
  onSuccess?: () => void; // para refrescar tabla si querés
}

export default function ModalBajaTipoActividad({ tipoActividad, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<TipoActividadBajaDTO>({
    fechaBaja: "",
    usuarioBaja: "",
    razonBaja: "",
    comentariosBaja: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.fechaBaja || !formData.usuarioBaja || !formData.razonBaja) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    try {
      await darDeBajaTipoDeActividad(tipoActividad.id, formData);
      toast.success("Tipo de actividad dado de baja correctamente");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : typeof err === "string" ? err : "Error al dar de baja";
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-lg animate-fadeIn">
        <h2 className="text-lg font-semibold mb-4">
          Dar de baja: <span className="text-blue-600">{tipoActividad.nombre}</span>
        </h2>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Fecha de baja *</label>
          <input
            type="date"
            name="fechaBaja"
            className="p-2 border rounded"
            value={formData.fechaBaja}
            onChange={handleChange}
          />

          <label className="text-sm font-medium">Usuario responsable *</label>
          <input
            type="text"
            name="usuarioBaja"
            placeholder="Ej: jwmendez"
            className="p-2 border rounded"
            value={formData.usuarioBaja}
            onChange={handleChange}
          />

          <label className="text-sm font-medium">Razón de la baja *</label>
          <input
            type="text"
            name="razonBaja"
            placeholder="Ej: Duplicado / No se utiliza más"
            className="p-2 border rounded"
            value={formData.razonBaja}
            onChange={handleChange}
          />

          <label className="text-sm font-medium">Comentarios adicionales</label>
          <textarea
            name="comentariosBaja"
            placeholder="Opcional"
            className="p-2 border rounded"
            rows={3}
            value={formData.comentariosBaja}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Dar de baja
          </button>
        </div>
      </div>
    </div>
  );
}
