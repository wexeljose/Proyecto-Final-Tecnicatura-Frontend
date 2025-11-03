"use client";
import toast from "react-hot-toast";

// Componente visual reutilizable
function ConfirmToast({
  message,
  resolve,
}: {
  message: string;
  resolve: (value: boolean) => void;
}) {
  const handleConfirm = () => {
    resolve(true);
    toast.dismiss();
  };

  const handleCancel = () => {
    resolve(false);
    toast.dismiss();
  };

  return (
    <div className="p-4 bg-white rounded shadow border border-gray-200 text-sm text-gray-900 flex flex-col gap-3 w-[280px]">
      <p className="font-medium">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleCancel}
          className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

// Función para usar en cualquier parte
export function confirmarAccion(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    toast.custom((t) => <ConfirmToast message={message} resolve={resolve} />, {
      duration: Infinity, // no desaparece hasta que el usuario haga clic
      position: "top-center",
    });
  });
}
