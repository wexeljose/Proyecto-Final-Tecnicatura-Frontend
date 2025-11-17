/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        token?: string;
        email?: string;
        name?: string;

        // 🔹 ÚNICO VALOR QUE IMPORTA
        tipoUsuario?: string; // "AuxiliarAdm" | "Socio" | "NoSocio"
    }

    interface Session {
        accessToken?: string;

        user: {
            id: string;
            email: string;
            name: string;

            // 🔹 Lo único que necesitamos para el Sidebar
            tipoUsuario?: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        id?: string;

        email?: string;
        name?: string;

        // 🔹 Lo único que vamos a guardar
        tipoUsuario?: string;
    }
}

