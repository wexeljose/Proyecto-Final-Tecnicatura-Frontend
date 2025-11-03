import { Perfil } from "../../../types/perfil";

interface Props {
  perfiles: Perfil[];
  onEdit: (perfil: Perfil) => void;
  onDelete: (id: number) => void;
}

export default function PerfilTable({ perfiles, onEdit, onDelete }: Props) {
  return (
    <table className="w-full border-collapse mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Nombre</th>
          <th className="p-2 border">Descripción</th>
          <th className="p-2 border">Estado</th>
          <th className="p-2 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {perfiles.map((p) => (
          <tr key={p.id} className="even:bg-gray-50">
            <td className="border p-2">{p.nombrePerfil}</td>
            <td className="border p-2">{p.descripcion}</td>
            <td className="border p-2">{p.estado}</td>
            <td className="border p-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  aria-label={`Editar perfil ${p.nombrePerfil}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {/* small edit icon (unicode) */}
                  <span className="text-sm">✎</span>
                  <span>Editar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(p.id)}
                  aria-label={`Eliminar perfil ${p.nombrePerfil}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-red-600 border border-red-300 text-sm font-medium rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <span className="text-sm">🗑</span>
                  <span>Eliminar</span>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
