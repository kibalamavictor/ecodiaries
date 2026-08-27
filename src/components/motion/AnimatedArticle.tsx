'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type AnimatedArticleProps = {
  children: ReactNode
  className?: string
}

export function AnimatedArticle({ children, className }: AnimatedArticleProps) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: reduce ? 0 : 0.15 }}
    >
      {children}
    </motion.article>
  )
}
