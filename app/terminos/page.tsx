"use client";

import Image from "next/image";
import Link from "next/link";

export default function TerminosPage() {
    return (
        <main className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            {/* Encabezado simple */}
            <header className="w-full flex items-center justify-center px-6 py-4 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                    <Image
                        src="/Logo_ASUR_sin_letras.png"
                        alt="Logo ASUR"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                    <h1
                        className="text-lg sm:text-xl text-blue-900 leading-tight"
                        style={{ fontFamily: '"Times New Roman", serif', fontWeight: "bold" }}
                    >
                        ASOCIACIÓN DE SORDOS DEL URUGUAY
                    </h1>
                </div>
            </header>

            {/* Contenido principal */}
            <section className="flex-grow w-full max-w-4xl mx-auto px-6 py-10 bg-white rounded-xl shadow-sm mt-6 mb-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
                    Términos y Condiciones de Uso
                </h2>

                <p className="text-gray-700 text-sm leading-relaxed text-justify mb-6">
                    Bienvenido/a a la plataforma digital de la Asociación de Sordos del Uruguay (ASUR).
                    Al registrarse, acceder o utilizar este sitio, usted acepta cumplir con los presentes
                    términos y condiciones, los cuales regulan el uso de nuestros servicios en línea.
                </p>

                <h3 className="font-semibold text-blue-800 mb-2">1. Uso del sitio</h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify mb-4">
                    El usuario se compromete a utilizar la plataforma de forma responsable, respetando las
                    normativas legales vigentes y evitando cualquier acción que pueda afectar el correcto
                    funcionamiento del sistema o vulnerar la privacidad de otros usuarios.
                </p>

                <h3 className="font-semibold text-blue-800 mb-2">2. Registro y veracidad de los datos</h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify mb-4">
                    Los datos proporcionados durante el registro deben ser verídicos, completos y actualizados.
                    ASUR se reserva el derecho de suspender o eliminar cuentas que contengan información falsa o
                    inexacta.
                </p>

                <h3 className="font-semibold text-blue-800 mb-2">3. Privacidad y protección de datos</h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify mb-4">
                    La información personal recopilada será utilizada únicamente con fines institucionales,
                    educativos y administrativos, respetando la Ley N° 18.331 de Protección de Datos Personales
                    y las políticas de privacidad internas de ASUR.
                </p>

                <h3 className="font-semibold text-blue-800 mb-2">4. Propiedad intelectual</h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify mb-4">
                    Todos los contenidos, materiales gráficos y textos de este sitio son propiedad de la
                    Asociación de Sordos del Uruguay y están protegidos por las leyes de derechos de autor.
                    Queda prohibida su reproducción total o parcial sin autorización previa.
                </p>

                <h3 className="font-semibold text-blue-800 mb-2">5. Modificaciones</h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify mb-4">
                    ASUR podrá modificar estos términos y condiciones en cualquier momento.
                    Los cambios entrarán en vigencia desde su publicación en la plataforma.
                </p>

                <h3 className="font-semibold text-blue-800 mb-2">6. Contacto</h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify mb-4">
                    Si tiene dudas o comentarios sobre estos términos, puede comunicarse con nosotros a través
                    del correo electrónico{" "}
                    <span className="font-semibold text-blue-900">contacto@asur.org.uy</span>.
                </p>

                <p className="text-center text-gray-600 text-sm mt-6 italic">
                    Última actualización: {new Date().toLocaleDateString("es-UY")}
                </p>

                {/* Botón de volver */}
                <div className="flex justify-center mt-8">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 text-sm bg-blue-900 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition"
                    >
                        ← Volver al registro
                    </Link>
                </div>
            </section>

            {/* Footer institucional */}
            <footer className="w-full bg-blue-900 text-white py-4 shadow-inner">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-center md:text-left">
                    <p className="text-xs">
                        © {new Date().getFullYear()} Asociación de Sordos del Uruguay — Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-blue-200 mt-1 md:mt-0">
                        Desarrollado por el equipo de proyecto MAVATECH – UTEC.
                    </p>
                </div>
            </footer>
        </main>
    );
}

