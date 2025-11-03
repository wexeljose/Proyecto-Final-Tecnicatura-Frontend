"use client";
import { useEffect, useState } from "react";
import { obtenerPerfiles, eliminarPerfil, actualizarPerfil, crearPerfil } from "../../services/perfil";
import { Perfil, UpdatePerfil } from "../../../types/perfil";
import PerfilTable from "../../../components/layout/perfil/PerfilTable";
import EditPerfilModal from "../../../components/layout/perfil/PerfilEditModal";
import { /*Toaster ,*/ toast } from "react-hot-toast";
import CrearPerfilModal from "../../../components/layout/perfil/PerfilCreateModal";
import PerfilFiltrosLayout from "../../../components/layout/perfil/PerfilFiltrosLayout";
import { confirmarAccion } from "../../../.idea/utils/confirmarAccion";



export default function ListadoPerfiles() {

  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  //const [selectedPerfil, setSelectedPerfil] = useState<Perfil | null>(null);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [crearPerfilModal, setCrearPerfilModal] = useState(false);
  const [selectedPerfil, setSelectedPerfil] = useState<Perfil | null>(null);
  const [perfilesFiltrados, setPerfilesFiltrados] = useState<Perfil[]>([]);


  async function cargarPerfiles() {
    setLoading(true);
    try {
      const data = await obtenerPerfiles();
      data.sort((a: Perfil, b: Perfil) => a.id - b.id);
      setPerfiles(data);
      setPerfilesFiltrados(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar perfiles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPerfiles();
  }, []);

  const aplicarFiltros = () => {
    let filtrados = [...perfiles];
    if (filtroNombre.trim()) {
      filtrados = filtrados.filter((p) =>
        p.nombrePerfil.toLowerCase().includes(filtroNombre.toLowerCase())
      );
    }
    if (filtroEstado) {
      filtrados = filtrados.filter((p) => p.estado === filtroEstado);
    }
    setPerfilesFiltrados(filtrados);
  };

  const handleDelete = async (id: number) => {
    const confirmado = await confirmarAccion("¿Seguro que deseas desactivar este perfil?");
    if (!confirmado) return;


    try {
      await toast.promise(
        eliminarPerfil(id),
        {
          loading: "Procesando...",
          success: "Perfil desactivado correctamente ✅",
          error: "No se pudo desactivar el perfil ❌",
        }
      );
      cargarPerfiles(); // recargar perfiles después de éxito
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (perfil: Perfil) => {
    setSelectedPerfil(perfil);
  };

  const handleSave = async (id: number, data: UpdatePerfil) => {
    const confirmado = await confirmarAccion("¿Seguro que deseas modificar este perfil?");
    if (!confirmado) return;
    try {
      await actualizarPerfil(id, data);
      toast.success("Perfil actualizado ✅");
      cargarPerfiles();
      setSelectedPerfil(null); // cerrar modal
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar el perfil ❌");
    }
  };
  
  const handleCrearPerfil = async (data: { nombrePerfil: string; descripcion: string }) => {
    try {
      await crearPerfil(data);
      toast.success("Perfil creado ✅");
      cargarPerfiles();
      setCrearPerfilModal(false); // cerrar modal
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el perfil ❌");
    }
  };

  if (loading) return <p>Cargando perfiles...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestión de Perfiles</h1>

      <div className="flex gap-6">
        {/* Tabla (principal) */}
        <div className="flex-1">
          <PerfilTable
            perfiles={perfilesFiltrados}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Panel lateral de filtros y crear */}
        <PerfilFiltrosLayout
          filtroNombre={filtroNombre}
          setFiltroNombre={setFiltroNombre}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          aplicarFiltros={aplicarFiltros}
          onCrear={() => setCrearPerfilModal(true)}
        />
      </div>

      {/* Modal editar */}
      {selectedPerfil && (
        <EditPerfilModal
          perfil={selectedPerfil}
          onClose={() => setSelectedPerfil(null)}
          onSave={handleSave}
        />
      )}

      {/* Modal crear */}
      {crearPerfilModal && (
        <CrearPerfilModal onClose={() => setCrearPerfilModal(false)} onCrear={handleCrearPerfil} />
      )}
    </div>
  );
}
