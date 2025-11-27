import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata = {
    title: "ASUR - Panel Administrativo",
    description: "Sistema de gestión desarrollado por Mavatech",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <body>
        {/* ✅ Providers SOLO para sesión y contextos */}
        <Providers>
            {children}
        </Providers>

        {/* ✅ Toaster afuera para evitar clipping y stacking issues */}
        <Toaster
            position="top-center"
            toastOptions={{
                style: { zIndex: 999999 },
            }}
        />
        </body>
        </html>
    );
}
