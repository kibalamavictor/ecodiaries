'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

type AnimatedHeroProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function AnimatedHero({ children, className, style }: AnimatedHeroProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
