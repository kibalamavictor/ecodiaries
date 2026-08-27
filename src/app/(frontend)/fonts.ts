import { Baloo_2, Inter, Playfair_Display } from 'next/font/google'

export const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-baloo',
  display: 'swap',
  preload: true,
})

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
})
