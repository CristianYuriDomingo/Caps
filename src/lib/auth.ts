// lib/auth.ts - Multi-Provider Setup (Fixed)
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Facebook OAuth (you'll need to set up Facebook app)
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    
    // Email & Password (Traditional login)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // Check if user exists and has a password (not OAuth-only user)
        if (!user || !user.password) return null

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role
        }
      }
    })
  ],
  
  session: {
    strategy: 'database', // Required for OAuth providers
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async session({ session, user }) {
      // Add custom user data to session
      if (session.user) {
        (session.user as any).id = user.id
        ;(session.user as any).role = (user as any).role || 'user'
      }
      return session
    },
    
    async signIn({ user, account, profile }) {
      // Handle different sign-in methods
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        // OAuth sign-in - user will be created/updated automatically by adapter
        return true
      }
      
      if (account?.provider === 'credentials') {
        // Credentials sign-in - user must exist (handled in authorize function)
        return true
      }
      
      return false
    }
  },
  
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    error: '/auth/error',   // Error page
    // Note: signUp is not a valid NextAuth page option
  },
  
  debug: process.env.NODE_ENV === 'development',
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)