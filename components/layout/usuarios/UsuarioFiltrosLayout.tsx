"use client";

interface Filtros {
    nombre: string;
    apellido: string;
    documento: string;
    tipoUsuario: string;
    estado: string;
}

interface Props {
    filtros: Filtros;
    setFiltros: (f: Filtros) => void;
    aplicarFiltros: () => void;
    recargarUsuarios: () => Promise<void>; // 👈 AGREGAR ESTA LÍNEA
}

export default function FiltrosUsuarios({ filtros, setFiltros }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    };

    const limpiarFiltros = () => {
        setFiltros({
            nombre: "",
            apellido: "",
            documento: "",
            tipoUsuario: "",
            estado: "",
        });
    };


    return (
        <div className="w-[240px] flex flex-col gap-2 p-3 border border-gray-200 rounded bg-white shadow">
            <h2 className="font-medium text-sm text-gray-900 pb-2 border-b border-gray-200">
                Filtros
            </h2>

            <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={filtros.nombre}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            />

            <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={filtros.apellido}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            />

            <input
                type="text"
                name="documento"
                placeholder="Documento"
                value={filtros.documento}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            />

            <select
                name="tipoUsuario"
                value={filtros.tipoUsuario}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            >
                <option value="">Tipo de Usuario</option>
                <option value="Socio">Socio</option>
                <option value="NoSocio">No Socio</option>
                <option value="AuxiliarAdm">Auxiliar Administrativo</option>
            </select>

            <select
                name="estado"
                value={filtros.estado}
                onChange={handleChange}
                className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500"
            >
                <option value="">Todos</option>
                <option value="Activos">Activo</option>
                <option value="Inactivos">Inactivo</option>
                <option value="Sin_validar">Sin validar</option>
            </select>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-200 mt-1">
                <button
                    onClick={limpiarFiltros}
                    className="inline-flex items-center justify-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100"
                >
                    Limpiar
                </button>
            </div>
        </div>
    );
}

