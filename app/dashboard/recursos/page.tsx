"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { confirmarAccion } from "../../../.idea/utils/confirmarAccion";

import {
    listarRecursosPorEstado,
    buscarRecursosPorNombre,
    buscarRecursosPorCapacidad,
    crearRecurso,
    actualizarRecurso,
    darDeBajaRecurso,
} from "../../services/recurso";
import type { Recurso, RecursoCreate, RecursoUpdate } from "../../../types/recurso";

import RecursoTable from "../../../components/layout/recursos/RecursoTable";
import RecursoCreateModal from "../../../components/layout/recursos/RecursoCreateModal";
import RecursoEditModal from "../../../components/layout/recursos/RecursoEditModal";
import RecursoFiltros from "../../../components/layout/recursos/RecursoFiltros";

/** Helper para stringify de errores sin usar `any` */
function getErrorMessage(err: unknown) {
    if (err instanceof Error) return err.message;
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}

export default function GestionEspaciosPage() {
    /** --- Estado listado --- */
    const [items, setItems] = useState<Recurso[]>([]);
    const [itemsFiltrados, setItemsFiltrados] = useState<Recurso[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    /** --- Filtros --- */
    const [fNombre, setFNombre] = useState<string>("");
    const [fEstado, setFEstado] = useState<"" | "Activos" | "Inactivos" | "Sin_validar">("");
    const [fCapMin, setFCapMin] = useState<string>("");

    /** --- Modales --- */
    const [crearModal, setCrearModal] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<Recurso | null>(null);

    /** Carga inicial (por defecto: Activos) */
    async function cargarInicial() {
        setLoading(true);
        try {
            const data = await listarRecursosPorEstado("Activos");
            data.sort((a, b) => a.id - b.id);
            setItems(data);
            setItemsFiltrados(data);
        } catch (e: unknown) {
            // mostramos en consola pero sin `any`
            // eslint-disable-next-line no-console
            console.error(e);
            toast.error(`No se pudieron cargar los recursos: ${getErrorMessage(e)}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void cargarInicial();
    }, []);

    /** Aplica filtros combinando los endpoints disponibles */
    const aplicarFiltros = async () => {
        try {
            // nombre tiene prioridad si está presente
            if (fNombre.trim()) {
                const porNombre = await buscarRecursosPorNombre(fNombre.trim());
                setItemsFiltrados(fEstado ? porNombre.filter((r) => r.estado === fEstado) : porNombre);
                return;
            }
            // luego capacidad mínima
            if (fCapMin) {
                const porCap = await buscarRecursosPorCapacidad(Number(fCapMin));
                setItemsFiltrados(fEstado ? porCap.filter((r) => r.estado === fEstado) : porCap);
                return;
            }
            // solo estado
            if (fEstado) {
                const porEstado = await listarRecursosPorEstado(fEstado);
                setItemsFiltrados(porEstado);
                return;
            }
            // sin filtros → dataset original cargado
            setItemsFiltrados(items);
        } catch (e: unknown) {
            // eslint-disable-next-line no-console
            console.error(e);
            toast.error(`Error al aplicar filtros: ${getErrorMessage(e)}`);
        }
    };

    /** Acciones CRUD */
    const handleBaja = async (id: number) => {
        const ok = await confirmarAccion("¿Dar de baja lógica este recurso?");
        if (!ok) return;
        try {
            await toast.promise(darDeBajaRecurso(id), {
                loading: "Procesando...",
                success: "Recurso dado de baja ✅",
                error: "No se pudo dar de baja ❌",
            });
            await cargarInicial();
        } catch (e: unknown) {
            // eslint-disable-next-line no-console
            console.error(e);
            toast.error(`Error al dar de baja: ${getErrorMessage(e)}`);
        }
    };

    const handleEdit = (item: Recurso) => setEditItem(item);

    const handleSave = async (id: number, dto: RecursoUpdate) => {
        const ok = await confirmarAccion("¿Guardar cambios del recurso?");
        if (!ok) return;
        try {
            await actualizarRecurso(id, dto);
            toast.success("Recurso actualizado ✅");
            setEditItem(null);
            await cargarInicial();
        } catch (e: unknown) {
            // eslint-disable-next-line no-console
            console.error(e);
            toast.error(`Error al actualizar ❌: ${getErrorMessage(e)}`);
        }
    };

    const handleCrear = async (dto: RecursoCreate) => {
        try {
            await crearRecurso(dto);
            toast.success("Recurso creado ✅");
            setCrearModal(false);
            await cargarInicial();
        } catch (e: unknown) {
            // eslint-disable-next-line no-console
            console.error(e);
            toast.error(`Error al crear ❌: ${getErrorMessage(e)}`);
        }
    };

    if (loading) return <p className="p-6">Cargando recursos…</p>;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Gestión de Espacios</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCrearModal(true)}
                        className="px-3 py-2 rounded bg-green-600 text-white"
                    >
                        Nuevo recurso
                    </button>
                </div>
            </div>

            <div className="flex gap-6">
                <div className="flex-1">
                    <RecursoTable items={itemsFiltrados} onEdit={handleEdit} onBaja={handleBaja} />
                </div>

                <RecursoFiltros
                    filtroNombre={fNombre}
                    setFiltroNombre={setFNombre}
                    filtroEstado={fEstado}
                    setFiltroEstado={setFEstado}
                    filtroCapMin={fCapMin}
                    setFiltroCapMin={setFCapMin}
                    aplicar={aplicarFiltros}
                    onCrear={() => setCrearModal(true)}
                />
            </div>

            {crearModal && (
                <RecursoCreateModal onClose={() => setCrearModal(false)} onCrear={handleCrear} />
            )}
            {editItem && (
                <RecursoEditModal item={editItem} onClose={() => setEditItem(null)} onSave={handleSave} />
            )}
        </div>
    );
}