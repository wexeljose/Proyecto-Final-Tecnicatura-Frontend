"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  onClose: () => void;
  onCrear: (data: any) => Promise<void>;
}

export default function CrearActividadModal({ onClose, onCrear }: Props) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    objetivo: "",
    fechaAct: "",
    horaAct: "",
    duracion: "",
    costoTicket: "",
    requiereInscripcion: false,
    fechaAperturaInscripcion: "",
    formaPago: "",
    observaciones: "",
    idRecurso: "",
    idTipoActividad: "",
  });

  // ✅ Maneja inputs, selects y checkbox correctamente
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm({ ...form, [name]: target.checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCrear(form);
      toast.success("Actividad creada ✅");
      onClose();
    } catch (error) {
      console.error("Error al crear actividad:", error);
      toast.error("Error al crear la actividad ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Nueva Actividad</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input
            className="border p-2"
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            required
          />
          <input
            className="border p-2"
            name="descripcion"
            placeholder="Descripción"
            onChange={handleChange}
            required
          />
          <input
            className="border p-2"
            name="objetivo"
            placeholder="Objetivo"
            onChange={handleChange}
            required
          />
          <input
            className="border p-2"
            type="date"
            name="fechaAct"
            onChange={handleChange}
            required
          />
          <input
            className="border p-2"
            type="time"
            name="horaAct"
            onChange={handleChange}
            required
          />
          <input
            className="border p-2"
            type="time"
            name="duracion"
            onChange={handleChange}
            required
          />
          <input
            className="border p-2"
            type="number"
            name="costoTicket"
            placeholder="Costo Ticket"
            onChange={handleChange}
            required
          />

          <label className="flex items-center gap-2 col-span-2">
            <input
              type="checkbox"
              name="requiereInscripcion"
              onChange={handleChange}
            />
            Requiere inscripción
          </label>

          <input
            className="border p-2"
            type="date"
            name="fechaAperturaInscripcion"
            onChange={handleChange}
            required
          />

          {/* ✅ Combobox de FormaCobro (Enum del backend) */}
          <select
            className="border p-2 rounded"
            name="formaPago"
            value={form.formaPago}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar forma de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Debito">Débito</option>
            <option value="Credito">Crédito</option>
          </select>

          <input
            className="border p-2"
            name="observaciones"
            placeholder="Observaciones"
            onChange={handleChange}
          />
          <input
            className="border p-2"
            type="number"
            name="idRecurso"
            placeholder="ID Recurso"
            onChange={handleChange}
            required
          />
          <input
            className="border p-2"
            type="number"
            name="idTipoActividad"
            placeholder="ID Tipo Actividad"
            onChange={handleChange}
            required
          />

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
