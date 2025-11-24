"use client";

import React from "react";
import { Actividad } from "../../../types/actividad";

interface Props {
  actividad: Actividad | null;
  onClose: () => void;
}

export default function DetalleActividad({ actividad, onClose }: Props) {
  if (!actividad) {
    return (
      <div className="p-4 text-gray-600 bg-gray-50 rounded border">
        Seleccioná una actividad para ver el detalle.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Detalle de Actividad</h2>

        <button
          className="text-red-600 hover:text-red-800 font-semibold"
          onClick={onClose}
        >
          ✕ Cerrar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">

        <p><strong>Nombre:</strong> {actividad.nombre}</p>

        <p className="col-span-2">
          <strong>Descripción:</strong> {actividad.descripcion}</p>

        <p className="col-span-2">
          <strong>Objetivo:</strong> {actividad.objetivo}</p>

        <p><strong>Fecha actividad:</strong> {actividad.fechaAct}</p>
        <p><strong>Hora actividad:</strong> {actividad.horaAct}</p>

        <p><strong>Duración:</strong> {actividad.duracion}</p>

        <p><strong>Costo ticket:</strong> {actividad.costoTicket} $</p>

        <p>
          <strong>Requiere inscripción:</strong>{" "}
          {actividad.requiereInscripcion ? "Sí" : "No"}
        </p>

        {actividad.requiereInscripcion && (
          <p>
            <strong>Fecha apertura inscripción:</strong>
            {actividad.fechaAperturaInscripcion}
          </p>
        )}

        <p className="col-span-2">
          <strong>Forma de pago:</strong> {actividad.formaPago}
        </p>

        <p className="col-span-2">
          <strong>Observaciones:</strong> {actividad.observaciones || "—"}
        </p>

        <p>
          <strong>Recurso asignado:</strong>{" "}
          {actividad.recursoNombre ?? actividad.idRecurso}
        </p>

        <p>
          <strong>Tipo de actividad:</strong>{" "}
          {actividad.tipoActividadNombre ?? actividad.idTipoActividad}
        </p>

      </div>
    </div>
  );
}
