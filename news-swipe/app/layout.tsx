import './globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
	title: 'News Swipe',
	description: 'Swipe through news, agree with the crowd to score points.',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
			</head>
			<body className="min-h-screen antialiased">
				<AuthProvider>
					{children}
				</AuthProvider>
			</body>
			
		</html>
	)
}