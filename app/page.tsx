"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function HomePage() {
    return (
        <main className="flex flex-col min-h-screen bg-white text-gray-900">
            {/* Header */}
            <header className="w-full flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                        <Image
                            src="/Logo_ASUR_sin_letras.png"
                            alt="Logo ASUR"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1
                        className="text-lg sm:text-xl text-blue-900 leading-tight"
                        style={{ fontFamily: '"Times New Roman", serif', fontWeight: "bold" }}
                    >
                        ASOCIACIÓN DE SORDOS DEL URUGUAY
                    </h1>
                </div>

                <nav className="flex gap-4">
                    <Link
                        href="/login"
                        className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
                    >
                        Iniciar sesión
                    </Link>
                    <Link
                        href="/register"
                        className="border border-blue-900 text-blue-900 px-4 py-2 rounded-md hover:bg-blue-900 hover:text-white transition"
                    >
                        Registrarse
                    </Link>
                </nav>
            </header>

            {/* Contenido scrolleable */}
            <div className="flex-grow overflow-y-auto">
                {/* Carrusel */}
                <section className="relative w-full h-[70vh]">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        autoplay={{ delay: 4000 }}
                        pagination={{ clickable: true }}
                        loop
                        className="w-full h-full"
                    >
                        {["carousel1.jpg", "carousel2.jpg", "carousel3.jpg"].map(
                            (img, index) => (
                                <SwiperSlide key={index}>
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={`/${img}`}
                                            alt={`Imagen ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    </div>
                                </SwiperSlide>
                            )
                        )}
                    </Swiper>
                </section>

                {/* Información institucional */}
                <section className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6 shadow-inner">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6 text-center">
                        <div>
                            <h3 className="font-bold text-lg mb-1">Nuestra misión</h3>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Promover la inclusión, educación y derechos de las personas sordas
                                en Uruguay.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Actividades</h3>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Capacitaciones y eventos que fortalecen la comunidad sorda y
                                difunden la lengua de señas uruguaya.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Contacto</h3>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Montevideo, Uruguay <br />
                                <span className="font-semibold text-white">
                                    contacto@asur.org.uy
                                </span>
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer institucional */}
            <footer className="w-full bg-blue-900 text-white py-4 shadow-inner mt-auto">
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





