import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { NotificationProvider } from '../components/ui/NotificationProvider'
import { NCIAAgent } from '../components/ai/NCIAAgent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nivaran | Public Grievance Redressal',
  description: 'AI-powered Enterprise Public Grievance Redressal System'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NotificationProvider>
            {children}
            <NCIAAgent />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
