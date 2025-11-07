"use client";

interface Props {
    filtroNombre: string;
    setFiltroNombre: (v: string) => void;
    filtroEstado: string;
    setFiltroEstado: (v: string) => void;
    aplicarFiltros: () => void;
    onCrear: () => void;
}

export default function FuncionalidadFiltrosLayout({
                                                       filtroNombre, setFiltroNombre, filtroEstado, setFiltroEstado, aplicarFiltros, onCrear,
                                                   }: Props) {
    const limpiar = () => {
        setFiltroNombre("");
        setFiltroEstado("");
        aplicarFiltros();
    };

    return (
        <div className="w-[240px] flex flex-col gap-2 p-3 border border-gray-200 rounded bg-white shadow">
            <h2 className="font-medium text-sm text-gray-900 pb-2 border-b">Filtros</h2>

            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Nombre</label>
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    className="w-full border border-gray-200 px-2 py-1.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Estado</label>
                <select
                    className="w-full border border-gray-200 px-2 py-1.5 rounded text-sm bg-white"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="Activos">Activos</option>
                    <option value="Inactivos">Inactivos</option>
                    <option value="Sin_validar">Sin validar</option>
                </select>
            </div>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-200 mt-1">
                <button onClick={aplicarFiltros} className="px-2 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100">
                    Buscar
                </button>
                <button onClick={limpiar} className="px-2 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100">
                    Limpiar
                </button>
                <button onClick={onCrear} className="px-2 py-1 bg-green-50 text-green-700 text-sm font-medium rounded hover:bg-green-100">
                    Crear funcionalidad
                </button>
            </div>
        </div>
    );
}