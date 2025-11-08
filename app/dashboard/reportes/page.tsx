"use client";
import Link from "next/link";

export default function ReportesIndexPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-2">Reportes del Sistema</h1>
      <p className="text-gray-600 mb-8">Selecciona un reporte para visualizar información.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">

        {/* Reporte de Inscripciones */}
        <div className="border rounded-xl bg-white shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-xl font-semibold mb-2">Reporte de Inscripciones</h2>
          <p className="text-gray-500 text-sm mb-4">Filtra por fechas, estado y actividad.</p>
          <Link href="reportes/inscripciones" className="block text-center">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Ver Reporte
            </button>
          </Link>
        </div>

        {/* Placeholder para futuros reportes */}
        <div className="border rounded-xl bg-white shadow-md p-6 opacity-60 cursor-not-allowed">
          <h2 className="text-xl font-semibold mb-2">Reporte de Actividades</h2>
          <p className="text-gray-500 text-sm">Próximamente</p>
        </div>
      </div>
    </div>
  );
}