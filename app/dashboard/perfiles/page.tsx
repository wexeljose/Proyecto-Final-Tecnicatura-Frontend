"use client";

import { useEffect, useState } from "react";
import { obtenerPerfiles } from "../../services/perfil";
import { Perfil } from "../../types/perfil.d.ts";
import PerfilTable from "../../components/layout/perfil/PerfilTable";

export default function ListadoPerfiles() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    cargar();
  }, []);

  if (loading) return <p>Cargando perfiles...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestión de Perfiles</h1>
      <PerfilTable
        perfiles={perfiles}
        onEdit={(p) => console.log("Editar", p)}
        onDelete={(id) => console.log("Eliminar", id)}
      />
    </div>
  );
}
