"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

interface Props {
  onClose: () => void;
  onCrear: (data: any) => Promise<void>;
}

export default function CrearActividadModal({ onClose, onCrear }: Props) {
  const { data: session } = useSession();
  const [recursos, setRecursos] = useState<any[]>([]);
  const [tiposActividad, setTiposActividad] = useState<any[]>([]);

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

  // 🔹 Cargar listas de recursos y tipos de actividad
  useEffect(() => {
    const cargarListas = async () => {
      const token = session?.accessToken;
      if (!token) return;

      try {
        const [recRes, tipoRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/recursos/lista`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/tipo-actividad/lista`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!recRes.ok || !tipoRes.ok) {
          throw new Error("Error al obtener listas desde el servidor");
        }

        const recursosData = await recRes.json();
        const tiposData = await tipoRes.json();

        setRecursos(recursosData);
        setTiposActividad(tiposData);
      } catch (err) {
        console.error("Error al cargar listas", err);
        toast.error("Error al cargar listas de selección ❌");
      }
    };

    cargarListas();
  }, [session]);

  //  Manejo de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  //  Envío del formulario
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

  //  Render del modal
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

          {/* Checkbox */}
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

          {/* Combobox Forma de Pago */}
          <select
            className="border p-2"
            name="formaPago"
            onChange={handleChange}
            value={form.formaPago}
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

          {/* 🧩 Combobox Recurso */}
          <select
            name="idRecurso"
            className="border p-2"
            onChange={handleChange}
            value={form.idRecurso}
            required
          >
            <option value="">Seleccionar recurso</option>
            {recursos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>

          {/* 🧩 Combobox Tipo de Actividad */}
          <select
            name="idTipoActividad"
            className="border p-2"
            onChange={handleChange}
            value={form.idTipoActividad}
            required
          >
            <option value="">Seleccionar tipo de actividad</option>
            {tiposActividad.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>

          {/* Botones */}
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
