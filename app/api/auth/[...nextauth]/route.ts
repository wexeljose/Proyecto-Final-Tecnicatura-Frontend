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
type AuthenticatedUser = User & {
    token?: string;
};


const handler = NextAuth({
    providers: [
        // 🔹 Login con Google (OAuth)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),

        // 🔹 Login con credenciales propias (backend)
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

    // 🔹 Callbacks: controlan el JWT, la sesión y la redirección
    callbacks: {
        // Generación del JWT interno de NextAuth
        async jwt({ token, user, account }) {
            // Si viene del login con credenciales (usuario clásico)
            if (user && "token" in user) {
                token.accessToken = (user as AuthenticatedUser).token!;
            }

            // Si viene de login con Google
            if (account?.provider === "google" && user?.email) {
                try {
                    const res = await axios.post<BackendLoginResponse>(
                        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login-google`,
                        { correo: user.email }
                    );

                    const data = res.data;
                    if (data && data.token) {
                        token.accessToken = data.token;
                    } else {
                        console.warn("El usuario de Google no existe en el sistema.");
                    }
                } catch (error) {
                    const err = error as AxiosError;
                    console.error("Error al autenticar Google en backend:", err.message);
                }
            }

            return token;
        },

        // Sesión del lado del cliente (Frontend)
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            return session;
        },

        // Redirección después del login
        async redirect({ url, baseUrl }) {
            if (url && url.includes("/api/auth/callback/google")) {
                return `${baseUrl}/dashboard`;
            }
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (url.startsWith(baseUrl)) return url;
            return `${baseUrl}/dashboard`;
        },
    },

    // 🔹 Clave secreta de NextAuth
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
