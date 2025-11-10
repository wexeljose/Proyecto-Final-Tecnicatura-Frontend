/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;      // ✅ Asegúrate que sea string
      name?: string;
      email?: string;
      role?: string;
      image?: string;
    };
  }

  interface User {
    id: string;         // ✅ ID del backend
    token: string;      // ✅ JWT token
    email?: string;
    name?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    id?: string;        // ✅ Agregar ID
    email?: string;
    role?: string;
  }
}

