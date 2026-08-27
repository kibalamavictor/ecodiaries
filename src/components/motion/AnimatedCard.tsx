'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type AnimatedCardProps = {
  children: ReactNode
  index: number
}

export function AnimatedCard({ children, index }: AnimatedCardProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -4,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)',
              transition: { duration: 0.2, ease: 'easeOut' },
            }
      }
      transition={{
        duration: 0.45,
        ease: 'easeOut',
        delay: reduce ? 0 : index * 0.08,
      }}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  )
}
