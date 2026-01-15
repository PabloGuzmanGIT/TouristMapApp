import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email y contraseña son requeridos")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.password) {
                    throw new Error("Credenciales inválidas")
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    throw new Error("Credenciales inválidas")
                }

                return {
                    id: user.id,
                    email: user.email!,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                    managedCityId: user.managedCityId || null
                } as any
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                // Attach role and managedCityId to token during sign-in
                token.managedCityId = user.managedCityId || null
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!
                session.user.role = token.role as string
                session.user.managedCityId = token.managedCityId as string | null
            }
            return session
        }
    },
    pages: {
        signIn: '/admin/login',
        error: '/admin/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}
