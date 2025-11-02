import { Perfil } from "../../../types/perfil";

export default function PerfilCard({ perfil }: { perfil: Perfil }) {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h2 className="font-semibold text-lg">{perfil.nombre}</h2>
      <p>{perfil.descripcion}</p>
      <span
        className={`text-sm px-2 py-1 rounded ${
          perfil.estado === "Activo" ? "bg-green-200 text-green-800" : "bg-gray-300 text-gray-700"
        }`}
      >
        {perfil.estado}
      </span>
    </div>
  );
}
