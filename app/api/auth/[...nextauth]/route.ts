import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios, { AxiosError } from "axios";

interface BackendLoginResponse {
    token: string;
    id: string; // ✅ Agregar el ID
    usuario?: {
        nombre1: string;
        apellido1: string;
        correo: string;
    };
}

const handler = NextAuth({
    providers: [
        // 🔹 Login con Google
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
                    
                    console.log("✅ Respuesta del backend:", data); // Debug
                    
                    if (data && data.token && data.id) {
                        return {
                            id: data.id, // ✅ ID real del usuario
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

    // 🔹 Página personalizada de login
    pages: {
        signIn: "/login",
    },

    // 🔹 Callbacks para manejar token, sesión y redirección
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as unknown as { token: string }).token;
                token.id = user.id; // ✅ Guardar ID en el token
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user.id = token.id as string; // ✅ Pasar ID a la sesión
            session.user.email = token.email as string;
            session.user.name = token.name as string;
            return session;
        },

        // 🔹 Redirección después de login exitoso
        async redirect({ url, baseUrl }) {
            console.log("Redirect callback → url:", url, "baseUrl:", baseUrl);

            // Si el flujo viene de Google o si el destino es desconocido, mandamos al dashboard
            if (url && url.includes("/api/auth/callback/google")) {
                return `${baseUrl}/dashboard`;
            }

            // Si ya es una URL interna válida
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (url.startsWith(baseUrl)) return url;

            // Redirección por defecto
            return `${baseUrl}/dashboard`;
        },
    },

    // 🔹 Clave secreta de NextAuth
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };