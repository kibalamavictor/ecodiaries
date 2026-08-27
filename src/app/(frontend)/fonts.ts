import { Baloo_2, Inter } from 'next/font/google'

export const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-baloo',
  display: 'swap',
  preload: true,
})

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})
