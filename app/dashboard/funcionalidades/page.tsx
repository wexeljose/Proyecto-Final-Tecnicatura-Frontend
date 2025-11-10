"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { confirmarAccion } from "../../../.idea/utils/confirmarAccion";

import {
    obtenerFuncionalidades,
    crearFuncionalidad,
    actualizarFuncionalidad,
    bajaFuncionalidad,
    obtenerFuncionalidadesActivas,
    listarFuncionalidadesPorPerfil,
    actualizarAccesosPerfil,
    asociarFuncionalidadAPerfil,
} from "../../services/funcionalidad";

import { obtenerPerfiles } from "../../services/perfil";

import { Funcionalidad, FuncionalidadCreate, FuncionalidadUpdate, PerfilFuncionalidadDTO } from "../../../types/funcionalidades";
import { Perfil } from "../../../types/perfil";

// Reuso de tus componentes homólogos a Perfiles
import FuncionalidadTable from "../../../components/layout/funcionalidades/FuncionalidadTable";
import FuncionalidadEditModal from "../../../components/layout/funcionalidades/FuncionalidadEditModal";
import FuncionalidadCreateModal from "../../../components/layout/funcionalidades/FuncionalidadCreateModal";
import FuncionalidadFiltrosLayout from "../../../components/layout/funcionalidades/FuncionalidadFiltrosLayout";

type TabKey = "listado" | "accesos";

export default function FuncionalidadesPage() {
    const [tab, setTab] = useState<TabKey>("listado");

    /** --- Estado del Listado (CRUD) --- */
    const [items, setItems] = useState<Funcionalidad[]>([]);
    const [itemsFiltrados, setItemsFiltrados] = useState<Funcionalidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [crearModal, setCrearModal] = useState(false);
    const [editItem, setEditItem] = useState<Funcionalidad | null>(null);

    /** --- Estado de Accesos por Perfil --- */
    const [perfiles, setPerfiles] = useState<Perfil[]>([]);
    const [perfilId, setPerfilId] = useState<number | "">("");
    const [funcsActivas, setFuncsActivas] = useState<Funcionalidad[]>([]);
    const [permitidas, setPermitidas] = useState<Set<number>>(new Set());
    const [loadingAccesos, setLoadingAccesos] = useState(false);
    const perfilSel = useMemo(() => perfiles.find(p => p.id === perfilId), [perfiles, perfilId]);

    /** --- Cargas iniciales --- */
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await obtenerFuncionalidades();
                data.sort((a, b) => a.id - b.id);
                setItems(data);
                setItemsFiltrados(data);
            } catch (e) {
                console.error(e);
                toast.error("Error al cargar funcionalidades");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Datos base para pestaña Accesos (solo cuando se entra a esa pestaña por primera vez)
    useEffect(() => {
        if (tab !== "accesos" || perfiles.length || funcsActivas.length) return;
        (async () => {
            try {
                const [p, f] = await Promise.all([obtenerPerfiles(), obtenerFuncionalidadesActivas()]);
                setPerfiles(p);
                setFuncsActivas(f);
            } catch {
                toast.error("No se pudieron cargar perfiles/funcionalidades");
            }
        })();
    }, [tab, perfiles.length, funcsActivas.length]);

    /** --- Listado: filtros --- */
    const aplicarFiltros = () => {
        let filtrados = [...items];
        if (filtroNombre.trim()) {
            const q = filtroNombre.toLowerCase();
            filtrados = filtrados.filter((f) => f.nombre.toLowerCase().includes(q));
        }
        if (filtroEstado) {
            filtrados = filtrados.filter((f) => f.estado === filtroEstado);
        }
        setItemsFiltrados(filtrados);
    };

    /** --- Listado: acciones CRUD --- */
    const reloadListado = async () => {
        try {
            const data = await obtenerFuncionalidades();
            data.sort((a, b) => a.id - b.id);
            setItems(data);
            setItemsFiltrados(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleBaja = async (id: number) => {
        const confirmado = await confirmarAccion("¿Seguro que deseas dar de baja esta funcionalidad?");
        if (!confirmado) return;
        try {
            await toast.promise(bajaFuncionalidad(id), {
                loading: "Procesando...",
                success: "Funcionalidad dada de baja ✅",
                error: "No se pudo dar de baja ❌",
            });
            reloadListado();
        } catch (e) {
            console.error(e);
        }
    };

    const handleEdit = (item: Funcionalidad) => setEditItem(item);

    const handleSave = async (id: number, data: FuncionalidadUpdate) => {
        const confirmado = await confirmarAccion("¿Seguro que deseas modificar esta funcionalidad?");
        if (!confirmado) return;
        try {
            await actualizarFuncionalidad(id, data);
            toast.success("Funcionalidad actualizada ✅");
            reloadListado();
            setEditItem(null);
        } catch (e) {
            console.error(e);
            toast.error("Error al actualizar ❌");
        }
    };

    const handleCrear = async (data: FuncionalidadCreate) => {
        try {
            await crearFuncionalidad(data);
            toast.success("Funcionalidad creada ✅");
            reloadListado();
            setCrearModal(false);
        } catch (e) {
            console.error(e);
            toast.error("Error al crear ❌");
        }
    };

    /** --- Accesos por Perfil --- */
    const cargarAccesos = async (id: number) => {
        setLoadingAccesos(true);
        try {
            const rels: PerfilFuncionalidadDTO[] = await listarFuncionalidadesPorPerfil(id);
            const activos = rels.filter(r => r.estado === "Activos").map(r => r.idFuncionalidad);
            setPermitidas(new Set(activos));
        } catch {
            toast.error("No se pudieron cargar accesos del perfil");
        } finally {
            setLoadingAccesos(false);
        }
    };

    const toggle = (idFunc: number) => {
        setPermitidas((prev) => {
            const next = new Set(prev);
            if (next.has(idFunc)) {
                next.delete(idFunc);
            } else {
                next.add(idFunc);
            }
            return next;
        });
    };

    const guardarAccesos = async () => {
        if (!perfilId) return;
        try {
            await actualizarAccesosPerfil(perfilId as number, Array.from(permitidas));
            toast.success("Accesos actualizados ✅");
        } catch (e) {
            console.error(e);
            toast.error("Error al actualizar accesos ❌");
        }
    };

    const asociarSiFalta = async (idFunc: number) => {
        if (!perfilId) return;
        try {
            await asociarFuncionalidadAPerfil(idFunc, perfilId as number);
            await cargarAccesos(perfilId as number);
            toast.success("Asociación creada");
        } catch (e) {
            console.error(e);
            toast.error("No se pudo asociar");
        }
    };

    /** --- Render --- */
    if (loading) return <p className="p-6">Cargando funcionalidades…</p>;

    return (
        <div className="p-6 space-y-5">
            {/* Header + Tabs */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Gestión de Funcionalidades</h1>
                <div className="inline-flex rounded-md border bg-white overflow-hidden">
                    <button
                        className={`px-4 py-2 text-sm ${tab==="listado" ? "bg-blue-600 text-white" : "hover:bg-gray-50"}`}
                        onClick={() => setTab("listado")}
                    >
                        Listado
                    </button>
                    <button
                        className={`px-4 py-2 text-sm ${tab==="accesos" ? "bg-blue-600 text-white" : "hover:bg-gray-50"}`}
                        onClick={() => setTab("accesos")}
                    >
                        Accesos por perfil
                    </button>
                </div>
            </div>

            {tab === "listado" && (
                <>
                    <div className="flex justify-between">
                        <div className="text-sm text-gray-600">
                            Mantené las funcionalidades y usá la pestaña “Accesos por perfil” para asignarlas.
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTab("accesos")}
                                className="px-3 py-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                                Ir a Accesos
                            </button>
                            <button
                                onClick={() => setCrearModal(true)}
                                className="px-3 py-2 rounded bg-green-600 text-white"
                            >
                                Nueva funcionalidad
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        {/* Tabla */}
                        <div className="flex-1">
                            <FuncionalidadTable items={itemsFiltrados} onEdit={handleEdit} onBaja={handleBaja} />
                        </div>

                        {/* Filtros */}
                        <FuncionalidadFiltrosLayout
                            filtroNombre={filtroNombre}
                            setFiltroNombre={setFiltroNombre}
                            filtroEstado={filtroEstado}
                            setFiltroEstado={setFiltroEstado}
                            aplicarFiltros={aplicarFiltros}
                            onCrear={() => setCrearModal(true)}
                        />
                    </div>

                    {/* Modales */}
                    {editItem && (
                        <FuncionalidadEditModal
                            item={editItem}
                            onClose={() => setEditItem(null)}
                            onSave={handleSave}
                        />
                    )}
                    {crearModal && (
                        <FuncionalidadCreateModal
                            onClose={() => setCrearModal(false)}
                            onCrear={handleCrear}
                        />
                    )}
                </>
            )}

            {tab === "accesos" && (
                <section className="space-y-4">
                    <div className="flex items-end gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Perfil</label>
                            <select
                                value={perfilId}
                                onChange={(e) => {
                                    const v = Number(e.target.value) || "";
                                    setPerfilId(v);
                                    if (v) cargarAccesos(v as number);
                                    else setPermitidas(new Set());
                                }}
                                className="border rounded px-2 py-1.5 bg-white"
                            >
                                <option value="">Seleccionar</option>
                                {perfiles.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombrePerfil}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={guardarAccesos}
                            disabled={!perfilId || loadingAccesos}
                            className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                        >
                            Guardar cambios
                        </button>
                    </div>

                    {!perfilSel ? (
                        <div className="text-gray-500">Elegí un perfil para gestionar sus accesos.</div>
                    ) : (
                        <div className="bg-white border rounded">
                            {loadingAccesos ? (
                                <div className="p-6 text-gray-500">Cargando accesos…</div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left px-3 py-2">Funcionalidad</th>
                                        <th className="text-left px-3 py-2">Descripción</th>
                                        <th className="px-3 py-2 text-center">Permitido</th>
                                        <th className="px-3 py-2 text-right">Acción</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                    {funcsActivas.map(f => (
                                        <tr key={f.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 font-medium">{f.nombre}</td>
                                            <td className="px-3 py-2">{f.descFunc}</td>
                                            <td className="px-3 py-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={permitidas.has(f.id)}
                                                    onChange={() => toggle(f.id)}
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <button
                                                    onClick={() => asociarSiFalta(f.id)}
                                                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                                                >
                                                    Asociar si falta
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!funcsActivas.length && (
                                        <tr><td colSpan={4} className="px-3 py-8 text-center text-gray-500">Sin funcionalidades activas</td></tr>
                                    )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}