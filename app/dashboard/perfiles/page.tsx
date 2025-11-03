"use client";

import { useEffect, useState } from "react";
import { obtenerPerfiles, eliminarPerfil } from "../../services/perfil";
import { Perfil } from "../../../types/perfil";
import PerfilTable from "../../../components/layout/perfil/PerfilTable";

export default function ListadoPerfiles() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);

  async function cargar() {
    try {
      const data = await obtenerPerfiles();
      setPerfiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este perfil?")) return;
    try {
      await eliminarPerfil(id);
      setPerfiles((prev) => prev.filter((p) => p.id !== id)); 
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el perfil");
    }
  };

  // ✏️ Función para editar (por ahora solo log)
  const handleEdit = (perfil: Perfil) => {
    console.log("Editar perfil:", perfil);
  };

  if (loading) return <p>Cargando perfiles...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestión de Perfiles</h1>
      <PerfilTable perfiles={perfiles} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
