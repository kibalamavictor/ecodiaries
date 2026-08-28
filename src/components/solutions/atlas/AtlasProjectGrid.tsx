'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MagCard } from '@/components/magazine/MagCard'
import { atlasProjectToMagCard } from '@/lib/magazine'
import type { AtlasProject } from '@/lib/solutions/types'

type AtlasProjectGridProps = {
  projects: AtlasProject[]
  hoveredId: string | null
  onHover: (id: string | null) => void
  compact?: boolean
}

export function AtlasProjectGrid({ projects, hoveredId, onHover, compact = false }: AtlasProjectGridProps) {
  if (!projects.length) {
    return <p className="atlas-grid-empty">No projects match these filters yet.</p>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${compact ? 'compact' : 'full'}-${projects.length}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={compact ? 'atlas-grid atlas-grid--compact' : 'atlas-grid'}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className={hoveredId === project.id ? 'mag-atlas-card is-active' : 'mag-atlas-card'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onMouseEnter={() => onHover(project.id)}
            onMouseLeave={() => onHover(null)}
          >
            <MagCard
              item={atlasProjectToMagCard(project)}
              size={compact ? 'sm' : 'md'}
              heading="h3"
              chip="below"
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
