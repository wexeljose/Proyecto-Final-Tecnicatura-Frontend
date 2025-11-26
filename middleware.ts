import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = req.nextUrl.pathname;

    // ⛔ No autenticado → al login
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const tipoUsuario = (token?.tipoUsuario ?? "") as string;

    // ✅ Rutas SOLO AuxiliarAdm
    const auxiliarRoutes = [
        "/dashboard/usuarios",
        "/dashboard/perfiles",
        "/dashboard/funcionalidades",
        "/dashboard/actividades",            // 👈 creación de actividades
        "/dashboard/tipo-actividad",
        "/dashboard/recursos",
        "/dashboard/pagos",
        "/dashboard/auditorias",
        "/dashboard/reportes"
    ];

    if (auxiliarRoutes.some(r => url.startsWith(r)) && tipoUsuario !== "AuxiliarAdm") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // ✅ Rutas para AuxiliarAdm y Socio, pero NO NoSocio
    const socioAndAuxRoutes = [
        "/dashboard/reserva" // 👈 reservas solo Socio + Aux
    ];

    if (socioAndAuxRoutes.some(r => url.startsWith(r)) && !["AuxiliarAdm", "Socio"].includes(tipoUsuario)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // ✅ Rutas accesibles para TODOS los autenticados
    const usuarioAutenticadoRoutes = [
        "/dashboard",
        "/dashboard/mis-datos",
        "/dashboard/inscripcion-actividades" // 👈 inscripción para todos
    ];

    if (usuarioAutenticadoRoutes.some(r => url.startsWith(r))) {
        return NextResponse.next();
    }

    // ✅ Todo lo demás → no autorizado
    return NextResponse.redirect(new URL("/unauthorized", req.url));
}

export const config = {
    matcher: ["/dashboard/:path*"],
};



