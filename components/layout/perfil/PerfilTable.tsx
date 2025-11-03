import { Perfil } from "../../../types/perfil";

interface Props {
  perfiles: Perfil[];
  onEdit: (perfil: Perfil) => void;
  onDelete: (id: number) => void;
}

export default function PerfilTable({ perfiles, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded text-sm">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b min-w-[100px] max-w-[120px]">Nombre</th>
            <th className="px-1 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b w-44">Descripción</th>
            <th className="px-2 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">Estado</th>
            <th className="px-2 py-1.5 bg-gray-50 text-left font-medium text-gray-500 uppercase tracking-wider border-b">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {perfiles.map((p) => (
            <tr 
              key={p.id} 
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-1 py-1.5 font-medium text-gray-900 truncate min-w-[100px] max-w-[120px]" title={p.nombrePerfil}>{p.nombrePerfil}</td>
              <td className="px-1 py-1.5 text-gray-500 w-44">
                <div className="line-clamp-3 break-words" title={p.descripcion}>
                  {p.descripcion}
                </div>
              </td>
              <td className="px-2 py-1.5 whitespace-nowrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium
                  ${p.estado === 'Activos' ? 'bg-green-100 text-green-800' : 
                    p.estado === 'Inactivos' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {p.estado}
                </span>
              </td>
              <td className="px-2 py-1.5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    aria-label={`Editar perfil ${p.nombrePerfil}`}
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="sr-only">Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    aria-label={`Eliminar perfil ${p.nombrePerfil}`}
                    className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 font-medium rounded hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="sr-only">Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
