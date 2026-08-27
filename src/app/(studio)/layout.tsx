import { Inter, JetBrains_Mono, Sora } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { StudioShell } from '@/components/studio/layout/studio-shell'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'Studio',
  robots: { index: false, follow: false },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${jetbrains.variable}`}>
      <body>
        <StudioShell>{children}</StudioShell>
      </body>
    </html>
  )
}
