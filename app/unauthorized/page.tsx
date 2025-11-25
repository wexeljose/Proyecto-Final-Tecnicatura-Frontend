export default function UnauthorizedPage() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso denegado</h1>
                <p className="text-gray-700 text-lg">
                    No tienes permisos para acceder a esta sección.
                </p>
            </div>
        </div>
    );
}
