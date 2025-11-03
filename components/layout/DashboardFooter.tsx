export default function DashboardFooter() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white py-3 shadow-inner text-center text-sm z-30">
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
