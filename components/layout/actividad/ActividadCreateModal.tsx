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

  // ------------------------ CARGA DE LISTAS ---------------------------
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

        const recursosData = await recRes.json();
        const tiposData = await tipoRes.json();

        setRecursos(recursosData);
        setTiposActividad(tiposData);
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar listas ❌");
      }
    };

    cargarListas();
  }, [session]);

  // ------------------------ CONTROL DE INPUTS ---------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // ------------------------ VALIDACIONES ---------------------------
  const validarCampos = () => {
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    const textoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,.()-]+$/;

    // Nombre
    if (!nombreRegex.test(form.nombre)) {
      toast.error("El nombre solo puede contener letras y espacios ❌");
      return false;
    }
    if (form.nombre.length > 50) {
      toast.error("El nombre no puede superar los 50 caracteres ❌");
      return false;
    }

    // Descripción
    if (!textoRegex.test(form.descripcion)) {
      toast.error("Descripción contiene caracteres inválidos ❌");
      return false;
    }
    if (form.descripcion.length > 150) {
      toast.error("Descripción demasiado larga (máx 150) ❌");
      return false;
    }

    // Objetivo
    if (!nombreRegex.test(form.objetivo)) {
      toast.error("El objetivo solo puede contener letras y espacios ❌");
      return false;
    }
    if (form.objetivo.length > 100) {
      toast.error("El objetivo no puede superar los 100 caracteres ❌");
      return false;
    }

    // Fecha de actividad
    if (new Date(form.fechaAct) < new Date(new Date().toDateString())) {
      toast.error("La fecha de la actividad no puede ser pasada ❌");
      return false;
    }

    // Hora
    if (!/^\d{2}:\d{2}$/.test(form.horaAct)) {
      toast.error("Hora inválida ❌");
      return false;
    }

    // Duración
    if (!/^\d{2}:\d{2}$/.test(form.duracion)) {
      toast.error("Duración inválida ❌");
      return false;
    }

    // Costo
    if (Number(form.costoTicket) <= 0) {
      toast.error("El costo debe ser un número positivo ❌");
      return false;
    }

    // Fecha apertura inscripción
    if (form.requiereInscripcion) {
      if (!form.fechaAperturaInscripcion) {
        toast.error("Debe establecer la fecha de apertura de inscripción ❌");
        return false;
      }
      if (new Date(form.fechaAperturaInscripcion) > new Date(form.fechaAct)) {
        toast.error("La fecha de apertura no puede ser posterior a la actividad ❌");
        return false;
      }
    }

    // Observaciones
    if (form.observaciones.length > 200) {
      toast.error("Observaciones demasiado largas (máx 200) ❌");
      return false;
    }

    // Combos
    if (!form.idRecurso) {
      toast.error("Debe seleccionar un recurso ❌");
      return false;
    }
    if (!form.idTipoActividad) {
      toast.error("Debe seleccionar un tipo de actividad ❌");
      return false;
    }

    return true;
  };

  // ------------------------ SUBMIT ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) return;

    try {
      await onCrear(form);
      toast.success("Actividad creada exitosamente ✅");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la actividad ❌");
    }
  };

  // ------------------------ UI ---------------------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Nueva Actividad</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input className="border p-2" name="nombre" placeholder="Nombre" onChange={handleChange} required />
          <input className="border p-2" name="descripcion" placeholder="Descripción" onChange={handleChange} required />

          <input className="border p-2" name="objetivo" placeholder="Objetivo" onChange={handleChange} required />

          <input className="border p-2" type="date" name="fechaAct" onChange={handleChange} required />
          <input className="border p-2" type="time" name="horaAct" onChange={handleChange} required />
          <input className="border p-2" type="time" name="duracion" onChange={handleChange} required />

          <input className="border p-2" type="number" name="costoTicket" placeholder="Costo Ticket" onChange={handleChange} required />

          <label className="flex items-center gap-2 col-span-2">
            <input type="checkbox" name="requiereInscripcion" onChange={handleChange} />
            Requiere inscripción
          </label>

          <input className="border p-2" type="date" name="fechaAperturaInscripcion" onChange={handleChange} />

          <select className="border p-2" name="formaPago" onChange={handleChange} required>
            <option value="">Seleccionar forma de pago</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Debito">Débito</option>
            <option value="Credito">Crédito</option>
          </select>

          <input className="border p-2" name="observaciones" placeholder="Observaciones" onChange={handleChange} />

          <select name="idRecurso" className="border p-2" onChange={handleChange} required>
            <option value="">Seleccionar recurso</option>
            {recursos.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>

          <select name="idTipoActividad" className="border p-2" onChange={handleChange} required>
            <option value="">Seleccionar tipo de actividad</option>
            {tiposActividad.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
