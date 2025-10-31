import "./globals.css";
import Providers from "./providers"; // 👈 Importamos el provider

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
        </Providers>
        </body>
        </html>
    );
}
