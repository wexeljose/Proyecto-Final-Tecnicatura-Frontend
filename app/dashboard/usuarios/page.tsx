"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
    obtenerUsuarios,
    bajaUsuario,
    actualizarUsuario,
} from "../../services/usuarios";
import { Usuario, UpdateUsuario } from "../../../types/usuarios";
import UsuarioTable from "../../../components/layout/usuarios/UsuarioTable";
import FiltrosUsuarios from "../../../components/layout/usuarios/UsuarioFiltrosLayout";
import EditUsuarioModal from "../../../components/layout/usuarios/UsuarioEditModal";
import { confirmarAccion } from "../../../.idea/utils/confirmarAccion";

export default function GestionUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null);

    // 🧩 Filtros
    const [filtros, setFiltros] = useState({
        nombre: "",
        apellido: "",
        documento: "",
        tipoUsuario: "",
        estado: "",
    });

    useEffect(() => {
        aplicarFiltros();
    }, [filtros]);


    // 🟢 Cargar usuarios
    const cargarUsuarios = async () => {
        setLoading(true);
        try {
            const session = await getSession();
            const correoActual = session?.user?.email; // o session.user.name, si usás nombre de usuario

            const data = await obtenerUsuarios();

            // 🔒 Excluir al usuario logueado
            const usuariosFiltrados = data.filter((u: Usuario) => u.correo !== correoActual);

            // ✅ Usar la lista filtrada para todo
            setUsuarios(usuariosFiltrados);
            aplicarFiltros(usuariosFiltrados, filtros);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar usuarios ❌");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        cargarUsuarios();
    }, []);

    // 🔍 Aplicar filtros
    const aplicarFiltros = (
        data: Usuario[] = usuarios,
        filtrosActuales = filtros
    ) => {
        let filtrados = [...data];

        if (filtrosActuales.nombre.trim()) {
            filtrados = filtrados.filter((u) =>
                `${u.nombre1} ${u.nombre2 ?? ""}`
                    .toLowerCase()
                    .includes(filtrosActuales.nombre.toLowerCase())
            );
        }

        if (filtrosActuales.apellido.trim()) {
            filtrados = filtrados.filter((u) =>
                `${u.apellido1} ${u.apellido2 ?? ""}`
                    .toLowerCase()
                    .includes(filtrosActuales.apellido.toLowerCase())
            );
        }

        if (filtrosActuales.documento.trim()) {
            filtrados = filtrados.filter((u) =>
                u.nroDocumento.includes(filtrosActuales.documento)
            );
        }

        if (filtrosActuales.tipoUsuario) {
            filtrados = filtrados.filter(
                (u) => u.tipoUsuario === filtrosActuales.tipoUsuario
            );
        }

        if (filtrosActuales.estado) {
            filtrados = filtrados.filter(
                (u) => u.estado === filtrosActuales.estado
            );
        }

        setUsuariosFiltrados(filtrados);
    };

    // 🗑️ Dar de baja
    const handleBaja = async (id: number) => {
        const confirmado = await confirmarAccion(
            "¿Seguro que deseas dar de baja este usuario?"
        );
        if (!confirmado) return;

        try {
            await toast.promise(bajaUsuario(id), {
                loading: "Procesando baja...",
                success: "Usuario dado de baja correctamente ✅",
                error: "Error al dar de baja ❌",
            });
            cargarUsuarios();
        } catch (error) {
            console.error(error);
        }
    };

    // 🔄 Actualizar estado (Validar o Reactivar)
    const handleActualizarEstado = async (usuario: Usuario, nuevoEstado: string) => {
        const texto =
            nuevoEstado === "Activos"
                ? usuario.estado === "Inactivos"
                    ? "¿Deseas reactivar este usuario?"
                    : "¿Deseas validar este usuario?"
                : "¿Confirmas el cambio de estado?";

        const confirmado = await confirmarAccion(texto);
        if (!confirmado) return;

        try {
            const dataActualizar: UpdateUsuario = {
                nombre1: usuario.nombre1,
                nombre2: usuario.nombre2,
                apellido1: usuario.apellido1,
                apellido2: usuario.apellido2,
                fechaNac: usuario.fechaNac,
                calle: usuario.calle,
                nroPuerta: usuario.nroPuerta,
                apto: usuario.apto,
                tipoUsuario: usuario.tipoUsuario,
                estado: nuevoEstado,
                idPerfil: usuario.idPerfil ?? 0,
                socioDatos: usuario.socioDatos ?? null,
            };

            await toast.promise(actualizarUsuario(usuario.id, dataActualizar), {
                loading: "Actualizando estado...",
                success: `Usuario ${
                    nuevoEstado === "Activos" ? "activado" : "actualizado"
                } correctamente ✅`,
                error: "Error al actualizar usuario ❌",
            });

            cargarUsuarios();
        } catch (error) {
            console.error(error);
        }
    };

    // ✏️ Guardar cambios en edición
    const handleGuardar = async (id: number, data: UpdateUsuario) => {
        try {
            await toast.promise(actualizarUsuario(id, data), {
                loading: "Guardando cambios...",
                success: "Usuario actualizado correctamente ✅",
                error: "Error al actualizar usuario ❌",
            });
            cargarUsuarios();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <p className="p-6 text-gray-500">Cargando usuarios...</p>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4 text-gray-800">Gestión de Usuarios</h1>

            {/* Contenedor principal: tabla + filtros */}
            <div className="flex items-start gap-6">
                {/* Tabla */}
                <div className="flex-1">
                    <UsuarioTable
                        usuarios={usuariosFiltrados}
                        onEditar={(u) => setUsuarioEditar(u)}
                        onBaja={handleBaja}
                        onActualizarEstado={handleActualizarEstado}
                    />
                </div>

                {/* Filtros */}
                <FiltrosUsuarios
                    filtros={filtros}
                    setFiltros={setFiltros}
                    aplicarFiltros={() => aplicarFiltros()}
                    recargarUsuarios={cargarUsuarios}
                />

            </div>

            {/* Modal de edición */}
            {usuarioEditar && (
                <EditUsuarioModal
                    usuario={usuarioEditar}
                    onClose={() => setUsuarioEditar(null)}
                    onSave={handleGuardar}
                />
            )}
        </div>
    );
}


