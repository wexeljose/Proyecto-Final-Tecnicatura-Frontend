export default function Footer() {
    return (
        <footer className="w-full bg-blue-900 text-white py-4 shadow-inner border-t border-blue-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-center md:text-left">
                <p className="text-xs">
                    © {new Date().getFullYear()} Asociación de Sordos del Uruguay — Todos los derechos reservados.
                </p>
                <p className="text-xs text-blue-200 mt-1 md:mt-0">
                    Desarrollado por el equipo de proyecto MAVATECH – UTEC.
                </p>
            </div>
        </footer>
    );
}
