import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

// ------------------------------------------------------
// 📌 Tipos del backend
// ------------------------------------------------------
interface BackendUser {
    id: string;
    nombre1: string;
    apellido1: string;
    correo: string;
    tipoUsuario: string;  // 🔹 LO ÚNICO QUE NOS IMPORTA
}

interface BackendLoginResponse {
    token: string;
    usuario?: BackendUser;
}

// ------------------------------------------------------
// 📌 NextAuth handler (LOGIN Google + Credenciales)
// ------------------------------------------------------
const handler = NextAuth({
    providers: [
        // ------------------ GOOGLE ------------------
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),

        // ---------------- CREDENCIALES ----------------
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Correo", type: "text" },
                password: { label: "Contraseña", type: "password" },
            },

            async authorize(credentials): Promise<User | null> {
                if (!credentials?.username || !credentials?.password) return null;

                try {
                    const res = await axios.post<BackendLoginResponse>(
                        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`,
                        {
                            correo: credentials.username,
                            contrasena: credentials.password,
                        }
                    );

                    const data = res.data;
                    const u = data.usuario;

                    if (data.token && u) {
                        const user: User = {
                            id: String(u.id),
                            name: `${u.nombre1} ${u.apellido1}`,
                            email: u.correo,
                            token: data.token,
                            tipoUsuario: u.tipoUsuario, // ⭐ ROL DEL BACKEND
                        };

                        return user;
                    }

                    return null;
                } catch {
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: "/login",
    },

    callbacks: {
        // ------------------------------------------------------
        // 📌 JWT Callback → Guarda datos en el token
        // ------------------------------------------------------
        async jwt({ token, user, account }) {
            // Login normal
            if (user) {
                token.accessToken = user.token;
                token.id = user.id;
                token.email = user.email!;
                token.name = user.name!;
                token.tipoUsuario = user.tipoUsuario; // ⭐ IMPORTANTE
            }

            // Login con Google → buscar usuario en tu backend
            if (account?.provider === "google" && user?.email) {
                try {
                    const res = await axios.post<BackendLoginResponse>(
                        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login-google`,
                        { correo: user.email }
                    );

                    const data = res.data;
                    const u = data.usuario;

                    if (u) {
                        token.accessToken = data.token;
                        token.id = u.id;
                        token.tipoUsuario = u.tipoUsuario;
                        token.email = u.correo;
                        token.name = `${u.nombre1} ${u.apellido1}`;
                    }
                } catch (e) {
                    console.error("Error login Google backend:", e);
                }
            }

            return token;
        },

        // ------------------------------------------------------
        // 📌 Session Callback → Expone datos al frontend
        // ------------------------------------------------------
        async session({ session, token }) {
            session.user.id = String(token.id);
            session.user.email = token.email ?? "";
            session.user.name = token.name ?? "";
            session.user.tipoUsuario = token.tipoUsuario; // ⭐ LO ÚNICO QUE QUIERES
            session.accessToken = token.accessToken ?? "";
            return session;
        },

        // ------------------------------------------------------
        // 📌 Redirect
        // ------------------------------------------------------
        async redirect({ url, baseUrl }) {
            if (url.includes("/api/auth/callback/google"))
                return `${baseUrl}/dashboard`;

            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (url.startsWith(baseUrl)) return url;

            return `${baseUrl}/dashboard`;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
