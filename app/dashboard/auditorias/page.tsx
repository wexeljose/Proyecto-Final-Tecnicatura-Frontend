"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { buscarAuditorias } from "../../services/auditoria";
import { Auditoria, FiltrosAuditoria } from "../../../types/auditoria";
import FiltrosAuditoriaPanel from "../../../components/layout/auditoria/FiltrosAuditoria";
import TablaAuditoria from "../../../components/layout/auditoria/TablaAuditoria";

export default function AuditoriasPage() {
    const { data: session } = useSession();
    const token = (session?.accessToken as string) ?? "";

    const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
    const [filtros, setFiltros] = useState<FiltrosAuditoria>({
        nombreUsuario: "",
        operacion: "",
        seccion: "",
        fechaDesde: "",
        fechaHasta: "",
        terminal: "",
    });

    const [page, setPage] = useState(0);
    const [size] = useState(50);

    // 🔹 Carga inicial sin filtros
    useEffect(() => {
        if (!token) return;
        cargarAuditorias();
    }, [token]);

    const cargarAuditorias = async () => {
        try {
            const res = await buscarAuditorias(token, filtros);
            setAuditorias(res ?? []);
            setPage(0);
        } catch {
            toast.error("Error al cargar auditorías ❌");
        }
    };

    // 🔹 Paginación local
    const paginadas = useMemo(() => {
        const start = page * size;
        const end = start + size;
        return auditorias.slice(start, end);
    }, [auditorias, page, size]);


    const onBuscar = async () => {
        const datos = await buscarAuditorias(token, filtros);
        setAuditorias(datos);
    };

    // 🔥 EJECUTA LA BÚSQUEDA AUTOMÁTICAMENTE CUANDO CAMBIAN LOS FILTROS
    useEffect(() => {
        onBuscar();
    }, [filtros]);



    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4 text-gray-800">Reporte de Auditoría</h1>

            <div className="flex items-start gap-6">
                <div className="flex-1">
                    <TablaAuditoria datos={paginadas} />

                    <div className="flex items-center gap-2 mt-3">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                        >
                            Anterior
                        </button>

                        <span className="text-sm text-gray-600">
                            Página {page + 1} de {Math.max(Math.ceil(auditorias.length / size), 1)}
                        </span>

                        <button
                            onClick={() =>
                                setPage((p) =>
                                    p + 1 < Math.ceil(auditorias.length / size) ? p + 1 : p
                                )
                            }
                            disabled={page + 1 >= Math.ceil(auditorias.length / size)}
                            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                <FiltrosAuditoriaPanel
                    filtros={filtros}
                    setFiltros={setFiltros}
                    onBuscar={onBuscar}
                />
            </div>
        </div>
    );
}
