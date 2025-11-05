"use client";

import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { crearActividad } from "../services/actividad";
import { Users, CalendarDays, CreditCard, ClipboardList } from "lucide-react";
import { toast } from "react-hot-toast";
import CrearActividadModal from "../../components/layout/actividad/ActividadCreateModal";
import { obtenerActividades} from "../services/actividad";

interface DashboardData {
  sociosActivos: number;
  actividadesAbiertas: number;
  reservasHoy: number;
  pagosPendientes: number;
}

interface DashboardCardProps {
  icon: JSX.Element;
  title: string;
  value: number;
}

export default function DashboardPage() {
  const [datos, setDatos] = useState<DashboardData>({
    sociosActivos: 0,
    actividadesAbiertas: 0,
    reservasHoy: 0,
    pagosPendientes: 0,
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const { data: session } = useSession();
  const usuario = session?.user?.name || "Usuario";

  // 🔹 Cargar datos del dashboard
  const cargarDashboard = async () => {
    try {
      const sesionActual = await getSession();
      const token = sesionActual?.accessToken;

      if (!token) {
        console.warn("⚠️ No se encontró token de sesión. El dashboard no se cargará.");
        return;
      }

      console.log("🔄 Cargando datos del dashboard...");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("❌ Error HTTP al cargar dashboard:", res.status, res.statusText);
        toast.error("Error al cargar datos del dashboard");
        return;
      }

      const data: DashboardData = await res.json();
      console.log("✅ Datos del dashboard cargados:", data);
      setDatos(data);

    } catch (error) {
      console.error("🔥 Error cargando dashboard:", error);
      toast.error("Error inesperado al cargar dashboard");
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  // 🔹 Manejar creación de actividad desde el modal
  const handleCrearActividad = async (nuevaActividad: any) => {
    try {
      console.log("🟢 Enviando nueva actividad al backend:", nuevaActividad);
      await crearActividad(nuevaActividad);

      toast.success("Actividad creada correctamente ✅");
      setMostrarModal(false);

      // 🔁 Refrescar el dashboard tras crear una nueva actividad
      await cargarDashboard();
    } catch (error) {
      console.error("🔥 Error al intentar crear actividad:", error);
      toast.error("Error inesperado al crear actividad ❌");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center py-10">
      <h2 className="text-lg font-medium mb-2 text-gray-700">
        Bienvenido/a, <span className="font-semibold">{usuario}</span>
      </h2>

      {/* 🔹 Tarjetas informativas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <DashboardCard
          icon={<Users className="text-blue-800" size={30} />}
          title="Socios Activos"
          value={datos.sociosActivos}
        />
        <DashboardCard
          icon={<ClipboardList className="text-blue-800" size={30} />}
          title="Actividades Abiertas"
          value={datos.actividadesAbiertas}
        />
        <DashboardCard
          icon={<CalendarDays className="text-blue-800" size={30} />}
          title="Reservas para Hoy"
          value={datos.reservasHoy}
        />
        <DashboardCard
          icon={<CreditCard className="text-blue-800" size={30} />}
          title="Pagos Pendientes"
          value={datos.pagosPendientes}
        />
      </div>

      {/* 🔹 Botones de acción */}
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <button
          className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
          onClick={() => {
            console.log("🟢 Clic en Nueva Actividad — abriendo modal...");
            setMostrarModal(true);
          }}
        >
          Nueva Actividad
        </button>

        <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
          Registrar Espacio
        </button>

        <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
          Registrar Pago
        </button>
      </div>

      {/* 🔹 Modal de creación */}
      {mostrarModal && (
        <CrearActividadModal
          onClose={() => {
            console.log("🔴 Modal cerrado manualmente.");
            setMostrarModal(false);
          }}
          onCrear={handleCrearActividad}
        />
      )}
    </section>
  );
}

// 🔹 Componente de tarjeta
function DashboardCard({ icon, title, value }: DashboardCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center border border-gray-100 hover:shadow-lg transition">
      {icon}
      <p className="text-3xl font-bold mt-2 text-blue-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </div>
  );
}
