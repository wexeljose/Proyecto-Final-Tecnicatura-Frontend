import DashboardFooter from "../components/layout/DashboardFooter";
import "./globals.css";
import Providers from "./providers"; // 👈 Importamos el provider
import { Toaster } from "react-hot-toast";

export const metadata = {
    title: "ASUR - Panel Administrativo",
    description: "Sistema de gestión desarrollado por Mavatech",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
        <body>
        <Providers>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
            <DashboardFooter />
        </Providers>
        </body>
        </html>
    );
}
