"use client";
import { useEffect, useState } from "react";
import { obtenerPerfiles, eliminarPerfil } from "../../services/perfil";
import { Perfil } from "../../../types/perfil";
import PerfilTable from "../../../components/layout/perfil/PerfilTable";
import { Toaster, toast } from "react-hot-toast";

export default function ListadoPerfiles() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Manejo de "eliminar" con toast
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este perfil?")) return;

    toast.promise(
      eliminarPerfil(id),
      {
        loading: "Procesando...",
        success: "Perfil desactivado correctamente ✅",
        error: "No se pudo desactivar el perfil ❌",
      }
    );

    try {
      await eliminarPerfil(id);
      // 🔹 Recargar la lista completa para reflejar cambios
      await cargarPerfiles();
    } catch (error) {
      console.error("Error al desactivar perfil:", error);
    }
  };

  const handleEdit = (perfil: Perfil) => {
    console.log("Editar perfil:", perfil);
    // Aquí podrías abrir un modal o redirigir a formulario usando perfil.id
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
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
