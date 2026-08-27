import { Inter, Marcellus, Montserrat } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

export const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
  preload: true,
})

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nav',
  display: 'swap',
  preload: true,
})
