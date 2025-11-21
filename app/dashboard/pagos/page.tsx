"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

import { listarRecursosPorEstado } from "../../services/recurso";
import {
    crearPago,
    modificarPago,
    listarPorUsuario,
    listarPorFormaCobro,
    listarPorEsCuota,
    listarPorFechas,
    reportePagos,
} from "../../services/pago";
import { obtenerUsuarios } from "../../services/usuarios";
import { listarActividadesConInscripcion } from "../../services/actividad";

import type { Pago, PagoCreate, PagoUpdate } from "../../../types/pago";
import type { Recurso } from "../../../types/recurso";
import type { Usuario } from "../../../types/usuarios";

import PagoTable from "../../../components/layout/pagos/PagoTable";
import PagoFiltros from "../../../components/layout/pagos/PagoFiltros";
import PagoCreateModal from "../../../components/layout/pagos/PagoCreateModal";
import PagoEditModal from "../../../components/layout/pagos/PagoEditModal";
import {Actividad} from "../../../types/actividad";

/* utils */
function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}

function getUserIdFromSession(s: Session | null): number {
    const u = s?.user as { idUsuario?: unknown } | undefined;
    return typeof u?.idUsuario === "number" ? u.idUsuario : 0;
}

export default function PagosPage() {
    /* data */
    const [items, setItems] = useState<Pago[]>([]);
    const [recursos, setRecursos] = useState<Recurso[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [loading, setLoading] = useState(true);

    /* filtros */
    const [idUsuario, setIdUsuario] = useState<string>("");
    const [formaCobro, setFormaCobro] = useState<string>("");
    const [esCuota, setEsCuota] = useState<string>(""); // "", "true", "false"
    const [desde, setDesde] = useState<string>("");
    const [hasta, setHasta] = useState<string>("");

    /* modales y estado auxiliar */
    const [crearModal, setCrearModal] = useState(false);
    const [editItem, setEditItem] = useState<Pago | null>(null);
    const [idUsuarioActual, setIdUsuarioActual] = useState<number>(0);

    /* carga inicial */
    useEffect(() => {
        (async () => {
            try {
                const [rec, allUsers, acts] = await Promise.all([
                    listarRecursosPorEstado("Activos"),
                    obtenerUsuarios(),
                    listarActividadesConInscripcion(),
                ]);
                setRecursos(rec);
                setUsuarios(
                    allUsers.filter(
                        (u: Usuario) =>
                            u.estado === "Activos" &&
                            (u.tipoUsuario === "Socio" || u.tipoUsuario === "NoSocio")
                    )
                );
                setActividades(acts);

                const s = await getSession();
                setIdUsuarioActual(getUserIdFromSession(s));

                setItems(await reportePagos({}));
            } catch (e) {
                console.error(e);
                toast.error(`No se pudieron cargar datos: ${getErrorMessage(e)}`);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    /* aplicar filtros */
    const aplicar = async (): Promise<void> => {
        try {
            if (idUsuario) {
                setItems(await listarPorUsuario(Number(idUsuario)));
                return;
            }
            if (formaCobro) {
                setItems(await listarPorFormaCobro(formaCobro));
                return;
            }
            if (esCuota) {
                setItems(await listarPorEsCuota(esCuota === "true"));
                return;
            }
            if (desde && hasta) {
                setItems(await listarPorFechas(desde, hasta));
                return;
            }
            // combinado (todos los filtros juntos)
            const r = await reportePagos({
                idUsuario: idUsuario ? Number(idUsuario) : undefined,
                formaCobro: formaCobro || undefined,
                esCuota: esCuota ? esCuota === "true" : undefined,
                desde: desde || undefined,
                hasta: hasta || undefined,
            });
            setItems(r);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            toast.error(`Error al aplicar filtros: ${getErrorMessage(e)}`);
        }
    };

    /* crear */
    const handleCrear = async (dto: PagoCreate): Promise<void> => {
        try {
            await crearPago(dto);
            toast.success("Pago registrado ✅");
            setCrearModal(false);
            await aplicar();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            toast.error(`Error al registrar: ${getErrorMessage(e)}`);
        }
    };

    /* guardar edición */
    const handleSave = async (id: number, dto: PagoUpdate): Promise<void> => {
        try {
            await modificarPago(id, dto);
            toast.success("Pago actualizado ✅");
            setEditItem(null);
            await aplicar();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            toast.error(`Error al actualizar: ${getErrorMessage(e)}`);
        }
    };

    if (loading) return <p className="p-6">Cargando pagos…</p>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Gestión de Pagos</h1>
                <button
                    className="px-3 py-2 rounded bg-green-600 text-white"
                    onClick={() => setCrearModal(true)}
                >
                    Registrar pago
                </button>
            </div>

            <div className="flex gap-6">
                <div className="flex-1">
                    <PagoTable
                        items={items}
                        onEdit={(p) => setEditItem(p)}
                        usuarios={usuarios}
                        recursos={recursos}
                        actividades={actividades}
                    />
                </div>

                <PagoFiltros
                    idUsuario={idUsuario}
                    setIdUsuario={setIdUsuario}
                    formaCobro={formaCobro}
                    setFormaCobro={setFormaCobro}
                    esCuota={esCuota}
                    setEsCuota={setEsCuota}
                    desde={desde}
                    setDesde={setDesde}
                    hasta={hasta}
                    setHasta={setHasta}
                    aplicar={aplicar}
                    onCrear={() => setCrearModal(true)}
                />
            </div>

            {crearModal && (
                <PagoCreateModal
                    onClose={() => setCrearModal(false)}
                    onCrear={handleCrear}
                    recursos={recursos}
                    usuarios={usuarios}
                    actividades={actividades}
                    idUsuarioActual={idUsuarioActual}
                />
            )}

            {editItem && (
                <PagoEditModal
                    item={editItem}
                    onClose={() => setEditItem(null)}
                    onSave={handleSave}
                    recursos={recursos}
                    actividades={actividades}
                />
            )}
        </div>
    );
}