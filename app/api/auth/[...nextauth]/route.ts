import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios, { AxiosError } from "axios";

interface BackendLoginResponse {
    token: string;
    id: string;
    usuario?: {
        id: string;
        nombre1: string;
        apellido1: string;
        correo: string;
    };
}

//type AuthenticatedUser = User & {
//    token?: string;
//};

const handler = NextAuth({
    providers: [
        // 🔹 Login con Google
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),

        // 🔹 Login con credenciales propias
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
                    
                    console.log("✅ Respuesta del backend:", data);
                    
                    if (data && data.token && data.usuario && data.usuario.id) {
                        return {
                            id: String(data.usuario.id),
                            name:
                                data.usuario?.nombre1 && data.usuario?.apellido1
                                    ? `${data.usuario.nombre1} ${data.usuario.apellido1}`
                                    : "Usuario",
                            email: data.usuario?.correo ?? credentials.username,
                            token: data.token,
                        } as User;
                    }

                    console.error("❌ Respuesta del backend incompleta:", data);
                    return null;
                } catch (error) {
                    const err = error as AxiosError;
                    console.error("❌ Error en login:", err.response?.data || err.message);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    callbacks: {
        // ✅ AQUÍ: Agregar account a los parámetros
        async jwt({ token, user, account }) {
            if (user) {
                token.accessToken = (user as unknown as { token: string }).token;
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }

            // 🟢 Login con Google - ahora account está definido
            if (account?.provider === "google" && user?.email) {
                try {
                    const res = await axios.post<BackendLoginResponse>(
                        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login-google`,
                        { correo: user.email }
                    );

                    const data = res.data;
                    if (data && data.token) {
                        token.accessToken = data.token;
                        token.name = user.name ?? "Usuario Google";
                        // ✅ También guardar el ID de Google si viene
                        if (data.usuario?.id) {
                            token.id = data.usuario.id;
                        }
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

        // Sesión visible en el frontend
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.id);
            }
            session.accessToken = token.accessToken as string;
            session.user.email = token.email as string;
            session.user.name = token.name as string;
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

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };