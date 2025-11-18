"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Actividad, UpdateActividad } from "../../../types/actividad";

interface Props {
  actividad: Actividad;
  onClose: () => void;
  onSave: (id: number, data: UpdateActividad) => Promise<void>;
}

export default function EditActividadModal({ actividad, onClose, onSave }: Props) {
  const [form, setForm] = useState<UpdateActividad>({
    descripcion: actividad.descripcion,
    objetivo: actividad.objetivo,
    fechaAct: actividad.fechaAct,
    horaAct: actividad.horaAct,
    duracion: actividad.duracion,
    costoTicket: actividad.costoTicket,
    formaPago: actividad.formaPago,
    observaciones: actividad.observaciones,
    estado: actividad.estado,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ------------------------ VALIDACIONES ---------------------------
  const validarFormulario = () => {
    const textoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,.()-]+$/;
    const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

    // Descripción
    if (!textoRegex.test(form.descripcion || "")) {
      toast.error("La descripción contiene caracteres inválidos ❌");
      return false;
    }
    if ((form.descripcion || "").length > 150) {
      toast.error("La descripción no puede superar 150 caracteres ❌");
      return false;
    }

    // Objetivo
    if (!letrasRegex.test(form.objetivo || "")) {
      toast.error("El objetivo solo puede contener letras y espacios ❌");
      return false;
    }
    if ((form.objetivo || "").length > 100) {
      toast.error("El objetivo no puede superar 100 caracteres ❌");
      return false;
    }

    // Fecha
    if (new Date(form.fechaAct ?? "") < new Date(new Date().toDateString())) {
      toast.error("La fecha de la actividad no puede ser pasada ❌");
      return false;
    }

    // Hora
    if (!/^\d{2}:\d{2}$/.test(form.horaAct || "")) {
      toast.error("La hora es inválida ❌");
      return false;
    }

    // Duración
    if (!/^\d{2}:\d{2}$/.test(form.duracion || "")) {
      toast.error("La duración es inválida ❌");
      return false;
    }

    // Costo
    if (Number(form.costoTicket) <= 0) {
      toast.error("El costo debe ser un número positivo ❌");
      return false;
    }

    // Forma de pago obligatoria
    if (!form.formaPago || form.formaPago.trim() === "") {
      toast.error("Debe indicar la forma de pago ❌");
      return false;
    }

    // Observaciones
    if ((form.observaciones || "").length > 200) {
      toast.error("Las observaciones no pueden superar 200 caracteres ❌");
      return false;
    }

    return true;
  };

  // ------------------------ SUBMIT ---------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      await onSave(actividad.id, form);
      toast.success("Actividad actualizada correctamente ✅");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la actividad ❌");
    }
  };

  // ------------------------ UI ---------------------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Editar Actividad</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input
            className="border p-2"
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion || ""}
            onChange={handleChange}
          />
          <input
            className="border p-2"
            name="objetivo"
            placeholder="Objetivo"
            value={form.objetivo || ""}
            onChange={handleChange}
          />

          <input
            className="border p-2"
            type="date"
            name="fechaAct"
            value={form.fechaAct || ""}
            onChange={handleChange}
          />
          <input
            className="border p-2"
            type="time"
            name="horaAct"
            value={form.horaAct || ""}
            onChange={handleChange}
          />

          <input
            className="border p-2"
            type="time"
            name="duracion"
            value={form.duracion || ""}
            onChange={handleChange}
          />
          <input
            className="border p-2"
            type="number"
            name="costoTicket"
            placeholder="Costo"
            value={form.costoTicket?.toString() || ""}
            onChange={handleChange}
          />

          <input
            className="border p-2"
            name="formaPago"
            placeholder="Forma de pago"
            value={form.formaPago || ""}
            onChange={handleChange}
          />

          <input
            className="border p-2"
            name="observaciones"
            placeholder="Observaciones"
            value={form.observaciones || ""}
            onChange={handleChange}
          />

          <select
            className="border p-2 col-span-2"
            name="estado"
            value={form.estado || ""}
            onChange={handleChange}
          >
            <option value="">Seleccionar estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivos">Inactivo</option>
          </select>

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

