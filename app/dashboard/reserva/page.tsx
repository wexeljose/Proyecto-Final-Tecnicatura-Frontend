"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getSession} from "next-auth/react";
import type { Session } from "next-auth";

import { listarRecursosPorEstado } from "../../services/recurso";
import { crearReserva, cancelarReserva, listarReservas, listarPorEstado, listarPorFecha, listarPorRecurso } from "../../services/reserva";
import type { Recurso } from "../../../types/recurso";
import type { Reserva, ReservaCreate, EstadoReserva } from "../../../types/reserva";

import ReservaCreateModal from "../../../components/layout/reserva/ReservaCreateModal";
import ReservaTable from "../../../components/layout/reserva/ReservaTable";
import ReservasFiltros from "../../../components/layout/reserva/ReservasFiltros";

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}

// 🔹 Helper para obtener idUsuario desde la sesión de NextAuth
function getUserIdFromSession(s: Session | null): number {
    const u = s?.user as { idUsuario?: unknown } | undefined;
    return typeof u?.idUsuario === "number" ? u.idUsuario : 0;
}

export default function ReservasPage() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [recursosActivos, setRecursosActivos] = useState<Recurso[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [fEstado, setFEstado] = useState<"" | EstadoReserva>("");
    const [fFecha, setFFecha] = useState<string>("");
    const [fRecursoId, setFRecursoId] = useState<string>("");

    // Modal y usuario actual
    const [crearModal, setCrearModal] = useState(false);
    const [idUsuarioActual, setIdUsuarioActual] = useState<number>(0);

    // 🔹 Carga inicial
    useEffect(() => {
        (async () => {
            try {
                // Recursos activos + reservas
                const [recursos, todas] = await Promise.all([
                    listarRecursosPorEstado("Activos"),
                    listarReservas(),
                ]);
                setRecursosActivos(recursos);
                setReservas(todas);

                // Obtener usuario actual desde sesión
                const session: Session | null = await getSession();
                const uid = getUserIdFromSession(session);
                setIdUsuarioActual(uid);
            } catch (e) {
                console.error(e);
                toast.error(`No se pudieron cargar datos: ${getErrorMessage(e)}`);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // 🔹 Aplicar filtros
    const aplicarFiltros = async (): Promise<void> => {
        try {
            if (fFecha) {
                const r = await listarPorFecha(fFecha);
                setReservas(fEstado ? r.filter((x) => x.estado === fEstado) : r);
                return;
            }
            if (fRecursoId) {
                const r = await listarPorRecurso(Number(fRecursoId));
                setReservas(fEstado ? r.filter((x) => x.estado === fEstado) : r);
                return;
            }
            if (fEstado) {
                const r = await listarPorEstado(fEstado);
                setReservas(r);
                return;
            }
            setReservas(await listarReservas());
        } catch (e) {
            console.error(e);
            toast.error(`Error al filtrar: ${getErrorMessage(e)}`);
        }
    };

    // 🔹 Crear reserva
    const handleCrear = async (dto: ReservaCreate): Promise<void> => {
        try {
            await crearReserva(dto);
            toast.success("Reserva creada ✅");
            setCrearModal(false);
            setReservas(await listarReservas());
        } catch (e) {
            console.error(e);
            toast.error(`Error al crear ❌: ${getErrorMessage(e)}`);
        }
    };

    // 🔹 Cancelar reserva
    const handleCancel = async (id: number): Promise<void> => {
        try {
            await cancelarReserva(id);
            toast.success("Reserva cancelada ✅");
            setReservas(await listarReservas());
        } catch (e) {
            console.error(e);
            toast.error(`No se pudo cancelar ❌: ${getErrorMessage(e)}`);
        }
    };

    if (loading) return <p className="p-6">Cargando reservas…</p>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Gestión de Reservas</h1>
                <button
                    className="px-3 py-2 rounded bg-green-600 text-white"
                    onClick={() => setCrearModal(true)}
                >
                    Nueva reserva
                </button>
            </div>

            <div className="flex gap-6">
                <div className="flex-1">
                    <ReservaTable data={reservas} onCancel={handleCancel} />
                </div>

                <ReservasFiltros
                    estado={fEstado}
                    setEstado={setFEstado}
                    fecha={fFecha}
                    setFecha={setFFecha}
                    recurso={fRecursoId}
                    setRecurso={setFRecursoId}
                    aplicar={aplicarFiltros}
                    onCrear={() => setCrearModal(true)}
                />
            </div>

            {crearModal && (
                <ReservaCreateModal
                    onClose={() => setCrearModal(false)}
                    onCrear={handleCrear}
                    recursos={recursosActivos}
                    idUsuarioActual={idUsuarioActual}
                />
            )}
        </div>
    );
}