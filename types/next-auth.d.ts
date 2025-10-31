/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            name?: string;
            email?: string;
            role?: string;
            image?: string;
        };
    }

    interface User {
        id: string;
        token: string;
        nombre: string;
        correo: string;
        rol: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        name?: string;
        email?: string;
        role?: string;
    }
}

