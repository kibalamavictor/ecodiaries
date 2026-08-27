'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type SolutionCoverTransitionProps = {
  slug: string
  src: string
  alt?: string
  className?: string
  imageClassName?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
}

export function solutionCoverLayoutId(slug: string): string {
  return `solution-cover-${slug}`
}

export function SolutionCoverTransition({
  slug,
  src,
  alt = '',
  className,
  imageClassName,
  sizes,
  priority,
  fill = true,
}: SolutionCoverTransitionProps) {
  return (
    <motion.div
      layoutId={solutionCoverLayoutId(slug)}
      layoutScroll={false}
      className={cn(fill && 'absolute inset-0 z-[1]', className)}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={cn('object-cover object-center', imageClassName)}
        sizes={sizes}
        priority={priority}
      />
    </motion.div>
  )
}
