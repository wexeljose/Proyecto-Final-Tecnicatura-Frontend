import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = req.nextUrl.pathname;

    // ⛔ No autenticado → al login
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const tipoUsuario = token.tipoUsuario; // 👈 este es el correcto

    // ✅ Rutas SOLO AuxiliarAdm
    const auxiliarRoutes = [
        "/dashboard/usuarios",
        "/dashboard/perfiles",
        "/dashboard/funcionalidades",
        "/dashboard/auditoria",
        "/dashboard/pagos",
        "/dashboard/actividades/admin",
        "/dashboard/espacios/admin",
        "/dashboard/tipos-actividad"
    ];

    if (auxiliarRoutes.some(r => url.startsWith(r)) && tipoUsuario !== "AuxiliarAdm") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // ✅ Rutas disponibles para Socio y NoSocio (y también AuxiliarAdm)
    const usuarioAutenticadoRoutes = [
        "/dashboard",
        "/dashboard/mis-datos",
        "/dashboard/actividades",
        "/dashboard/reservas"
    ];

    if (usuarioAutenticadoRoutes.some(r => url.startsWith(r))) {
        return NextResponse.next();
    }

    // ✅ Si cae aquí → no tiene permisos
    return NextResponse.redirect(new URL("/unauthorized", req.url));
}

export const config = {
    matcher: ["/dashboard/:path*"],
};

