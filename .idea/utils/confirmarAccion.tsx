"use client";
import toast from "react-hot-toast";
import { useEffect } from "react";

type ConfirmType = "default" | "warning" | "danger";

interface ConfirmToastProps {
    message: string;
    resolve: (value: boolean) => void;
    type: ConfirmType;
}

// ✅ Estilos según tipo de acción
const buttonStyles: Record<ConfirmType, string> = {
    default: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    warning: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
};

// ✅ Componente visual reutilizable
function ConfirmToast({ message, resolve, type }: ConfirmToastProps) {

    const handleConfirm = () => {
        resolve(true);
        cleanup();
    };

    const handleCancel = () => {
        resolve(false);
        cleanup();
    };

    // ✅ Soporte para tecla ESC
    useEffect(() => {
        const escHandler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleCancel();
            }
        };

        disableInteractions();
        document.addEventListener("keydown", escHandler);
        return () => {
            document.removeEventListener("keydown", escHandler);
            enableInteractions();
        };
    }, []);

    return (
        <div
            className="p-4 bg-white rounded-lg shadow-lg border border-gray-200
          text-sm text-gray-900 flex flex-col gap-3 w-[300px]
          animate-fadeIn pointer-events-auto z-[999999]"
        >
            <p className="font-medium text-center">{message}</p>

            <div className="flex justify-center gap-3 mt-1">
                <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700
                  text-sm font-medium rounded hover:bg-gray-300 focus:outline-none
                  focus:ring-1 focus:ring-gray-400 transition duration-200"
                >
                    Cancelar
                </button>

                <button
                    onClick={handleConfirm}
                    className={`inline-flex items-center px-3 py-1 text-white text-sm font-medium rounded
                  focus:outline-none focus:ring-1 transition duration-200 ${buttonStyles[type]}`}
                >
                    Confirmar
                </button>
            </div>
        </div>
    );
}

/* -------------------------
   🔒 Bloquear el resto de la UI
---------------------------*/
function disableInteractions() {
    document.body.style.pointerEvents = "none";
}

/* -------------------------
   🔓 Restaurar estado normal
---------------------------*/
function enableInteractions() {
    document.body.style.pointerEvents = "auto";
}

/* -------------------------
   🧹 Limpieza total
---------------------------*/
function cleanup() {
    enableInteractions();
    toast.remove();
}

/* -------------------------
   ✅ Función principal para usar
---------------------------*/
export function confirmarAccion(
    message: string,
    type: ConfirmType = "default"
): Promise<boolean> {

    return new Promise((resolve) => {

        // Fondo oscurecido
        toast.custom(
            () => (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px]
              animate-fadeIn pointer-events-auto z-[999998]"></div>
            ),
            { duration: Infinity }
        );

        // Popup de confirmación
        toast.custom(
            () => <ConfirmToast message={message} resolve={resolve} type={type} />,
            {
                duration: Infinity,
                position: "top-center",
            }
        );
    });
}

/* -------------------------
   ✅ Animaciones CSS
---------------------------*/
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
`;
document.head.appendChild(style);
