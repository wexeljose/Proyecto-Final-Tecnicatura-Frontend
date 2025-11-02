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
          <tr key={p.id}>
            <td className="border p-2">{p.nombre}</td>
            <td className="border p-2">{p.descripcion}</td>
            <td className="border p-2">{p.estado}</td>
            <td className="border p-2 space-x-2">
              <button onClick={() => onEdit(p)} className="text-blue-600 hover:underline">
                Editar
              </button>
              <button onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
