"use client";
import { useState } from "react";
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await onSave(actividad.id, form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Editar Actividad</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input className="border p-2" name="descripcion" placeholder="Descripción" value={form.descripcion || ""} onChange={handleChange} />
          <input className="border p-2" name="objetivo" placeholder="Objetivo" value={form.objetivo || ""} onChange={handleChange} />
          <input className="border p-2" type="date" name="fechaAct" value={form.fechaAct || ""} onChange={handleChange} />
          <input className="border p-2" type="time" name="horaAct" value={form.horaAct || ""} onChange={handleChange} />
          <input className="border p-2" type="time" name="duracion" value={form.duracion || ""} onChange={handleChange} />
          <input className="border p-2" type="number" name="costoTicket" placeholder="Costo" value={form.costoTicket?.toString() || ""} onChange={handleChange} />
          <input className="border p-2" name="formaPago" placeholder="Forma de pago" value={form.formaPago || ""} onChange={handleChange} />
          <input className="border p-2" name="observaciones" placeholder="Observaciones" value={form.observaciones || ""} onChange={handleChange} />
          <select className="border p-2 col-span-2" name="estado" value={form.estado || ""} onChange={handleChange}>
            <option value="">Seleccionar estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}
