"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { listarAuditorias } from "../../services/auditoria";
import { Auditoria, FiltrosAuditoria } from "../../../types/auditoria";
import FiltrosAuditoriaPanel from "../../../components/layout/auditoria/FiltrosAuditoria";
import TablaAuditoria from "../../../components/layout/auditoria/TablaAuditoria";

export default function AuditoriasPage() {
    const { data: session } = useSession();
    const token = (session?.accessToken as string) ?? "";

    // datos de la página actual
    const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
    const [page, setPage] = useState(0);
    const [size] = useState(50);
    const [totalPages, setTotalPages] = useState(0);

    // filtros instantáneos
    const [filtros, setFiltros] = useState<FiltrosAuditoria>({
        nombreUsuario: "",
        operacion: "",
        seccion: "",
        fechaDesde: "",
        fechaHasta: "",
        terminal: "",
    });

    useEffect(() => {
        if (!token) return;
        (async () => {
            try {
                const res = await listarAuditorias(token, page, size);
                setAuditorias(res.content ?? []);
                setTotalPages(res.totalPages ?? 0);
            } catch {
                toast.error("Error al cargar auditorías ❌");
            }
        })();
    }, [token, page, size]);

    const parseISO = (s: string) => {
        const d = new Date(s);
        return isNaN(d.getTime()) ? null : d;
    };

    const toStartOfDay = (yyyyMMdd: string) =>
        new Date(`${yyyyMMdd}T00:00:00`);
    const toEndOfDay = (yyyyMMdd: string) =>
        new Date(`${yyyyMMdd}T23:59:59.999`);


    // filtro instantáneo en memoria (sobre la página cargada)
    const filtradas = useMemo(() => {
        let lista = [...auditorias];

        if (filtros.nombreUsuario.trim()) {
            const t = filtros.nombreUsuario.trim().toLowerCase();
            lista = lista.filter((a) => a.nombreUsuario?.toLowerCase().includes(t));
        }

        if (filtros.operacion.trim()) {
            const t = filtros.operacion.trim().toLowerCase();
            lista = lista.filter((a) => a.operacion?.toLowerCase().includes(t));
        }

        if (filtros.seccion.trim()) {
            const t = filtros.seccion.trim().toLowerCase();
            lista = lista.filter((a) => a.seccion?.toLowerCase().includes(t));
        }

        if (filtros.terminal.trim()) {
            const t = filtros.terminal.trim().toLowerCase();
            lista = lista.filter((a) => a.terminal?.toLowerCase().includes(t));
        }

        const hasDesde = filtros.fechaDesde.trim().length > 0;
        const hasHasta = filtros.fechaHasta.trim().length > 0;

        if (hasDesde || hasHasta) {
            const desde = hasDesde ? toStartOfDay(filtros.fechaDesde.trim()) : null;
            const hasta = hasHasta ? toEndOfDay(filtros.fechaHasta.trim()) : null;

            lista = lista.filter((a) => {
                const fa = parseISO(a.fecha);
                if (!fa) return false;
                if (desde && fa < desde) return false;
                if (hasta && fa > hasta) return false;
                return true;
            });
        }

        return lista;
    }, [auditorias, filtros]);

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4 text-gray-800">Reporte de Auditoría</h1>

            <div className="flex items-start gap-6">
                <div className="flex-1">
                    <TablaAuditoria datos={filtradas} />

                    {/* Paginación simple */}
                    <div className="flex items-center gap-2 mt-3">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-gray-600">
              Página {page + 1} de {Math.max(totalPages, 1)}
            </span>
                        <button
                            onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                            disabled={page + 1 >= totalPages}
                            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                {/* Sidebar de filtros (igual estilo a Usuarios) */}
                <FiltrosAuditoriaPanel filtros={filtros} setFiltros={setFiltros} />
            </div>
        </div>
    );
}
