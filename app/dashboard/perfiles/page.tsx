"use client";
import { useEffect, useState } from "react";
import { obtenerPerfiles, eliminarPerfil, actualizarPerfil } from "../../services/perfil";
import { Perfil, UpdatePerfil } from "../../../types/perfil";
import PerfilTable from "../../../components/layout/perfil/PerfilTable";
import EditPerfilModal from "../../../components/layout/perfil/PerfilEditModal";
import { Toaster, toast } from "react-hot-toast";

export default function ListadoPerfiles() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerfil, setSelectedPerfil] = useState<Perfil | null>(null);

  async function cargarPerfiles() {
    setLoading(true);
    try {
      const data = await obtenerPerfiles();
      data.sort((a: Perfil, b: Perfil) => a.id - b.id);
      setPerfiles(data);
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

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas desactivar este perfil?")) return;

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

  if (loading) return <p>Cargando perfiles...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestión de Perfiles</h1>
      <PerfilTable
        perfiles={perfiles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      {selectedPerfil && (
        <EditPerfilModal
          perfil={selectedPerfil}
          onClose={() => setSelectedPerfil(null)}
          onSave={handleSave}
        />
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
