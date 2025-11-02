"use client";

import { useState, useEffect } from "react";

// ✅ Definimos una interfaz para los datos de perfil
interface Perfil {
  id: number;
  nombre: string;
  descripcion: string;
  estado: "Activo" | "Inactivo";
}

export default function ListadoPerfiles() {
  // Estados
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "Activo" | "Inactivo">("todos");

  // useEffect → simula carga inicial de datos (más adelante será fetch a API)
  useEffect(() => {
    const perfilesSimulados: Perfil[] = [
      { id: 1, nombre: "Socio", descripcion: "Acceso completo", estado: "Activo" },
      { id: 2, nombre: "No Socio", descripcion: "Acceso limitado", estado: "Inactivo" },
      { id: 3, nombre: "Auxiliar Administrativo", descripcion: "Gestión administrativa", estado: "Activo" },
    ];
    setPerfiles(perfilesSimulados);
  }, []);

  // Función para filtrar
  const perfilesFiltrados = perfiles.filter((perfil) => {
    const coincideNombre = perfil.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideEstado =
      filtroEstado === "todos" ? true : perfil.estado.toLowerCase() === filtroEstado.toLowerCase();
    return coincideNombre && coincideEstado;
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Gestión de Perfiles</h1>

      {/* Filtros */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as "todos" | "Activo" | "Inactivo")}
          style={{ padding: "0.5rem" }}
        >
          <option value="todos">Todos</option>
          <option value="Activo">Activos</option>
          <option value="Inactivo">Inactivos</option>
        </select>
      </div>

      {/* Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Descripción</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {perfilesFiltrados.map((perfil) => (
            <tr key={perfil.id}>
              <td style={tdStyle}>{perfil.id}</td>
              <td style={tdStyle}>{perfil.nombre}</td>
              <td style={tdStyle}>{perfil.descripcion}</td>
              <td style={tdStyle}>{perfil.estado}</td>
              <td style={tdStyle}>
                <button style={buttonStyle}>Editar</button>
                <button style={{ ...buttonStyle, backgroundColor: "tomato", color: "white" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Estilos inline simples
const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "0.5rem",
};

const buttonStyle: React.CSSProperties = {
  marginRight: "0.5rem",
  padding: "0.3rem 0.8rem",
  cursor: "pointer",
};
