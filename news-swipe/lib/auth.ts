import type { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6)
})

export const authOptions: NextAuthOptions = {
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			authorize: async (creds) => {
				const parse = credentialsSchema.safeParse(creds)
				if (!parse.success) return null
				const { email, password } = parse.data
				const user = await prisma.user.findUnique({ where: { email } })
				if (!user) return null
				const ok = await compare(password, user.passwordHash)
				if (!ok) return null
				return { id: user.id, email: user.email, name: user.name ?? undefined }
			}
		})
	],
	callbacks: {
		session: async ({ session, token }) => {
			if (session.user && token.sub) {
				(session.user as any).id = token.sub
			}
			return session
		}
	},
	secret: process.env.NEXTAUTH_SECRET
}