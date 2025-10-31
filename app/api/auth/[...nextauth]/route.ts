import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios, { AxiosError } from "axios";

interface BackendLoginResponse {
    token: string;
    usuario?: {
        nombre1: string;
        apellido1: string;
        correo: string;
    };
}

const handler = NextAuth({
    providers: [
        // 🔹 Login con Google (opcional)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),

        // 🔹 Login con credenciales personalizadas (tu backend)
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Correo", type: "text" },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.username || !credentials?.password) {
                    console.error("Faltan credenciales");
                    return null;
                }

                try {
                    const res = await axios.post<BackendLoginResponse>(
                        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`,
                        {
                            correo: credentials.username,
                            contrasena: credentials.password,
                        }
                    );

                    const data = res.data;
                    if (data && data.token) {
                        return {
                            id: "login",
                            name:
                                data.usuario?.nombre1 && data.usuario?.apellido1
                                    ? `${data.usuario.nombre1} ${data.usuario.apellido1}`
                                    : "Usuario",
                            email: data.usuario?.correo ?? "",
                            token: data.token,
                        } as User;
                    }

                    return null;
                } catch (error) {
                    const err = error as AxiosError;
                    console.error("Error en login:", err.response?.data || err.message);
                    return null;
                }
            },
        }),
    ],

    // 🔹 Página personalizada de login
    pages: {
        signIn: "/login",
    },

    // 🔹 Callbacks para manejar token y sesión
    callbacks: {
        async jwt({ token, user }) {
            if (user && "token" in user) {
                token.accessToken = (user as unknown as { token: string }).token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            return session;
        },
    },

    // 🔹 Clave secreta de NextAuth
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
