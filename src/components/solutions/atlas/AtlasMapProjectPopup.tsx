'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { StagePill } from '@/components/solutions/StagePill'
import type { AtlasProject } from '@/lib/solutions/types'

type AtlasMapProjectPopupProps = {
  project: AtlasProject | null
  onClose: () => void
}

export function AtlasMapProjectPopup({ project, onClose }: AtlasMapProjectPopupProps) {
  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="atlas-map-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="atlas-map-popup__panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="atlas-map-popup-title"
          >
            <div className="atlas-map-popup__media">
              <Image src={project.coverImageUrl} alt="" fill className="object-cover" sizes="400px" />
            </div>
            <div className="atlas-map-popup__body">
              <span className="mag-chip">{project.organization?.name || 'Field project'}</span>
              <h3 id="atlas-map-popup-title" className="atlas-map-popup__title">
                {project.title}
              </h3>
              <p className="atlas-map-popup__summary">{project.summary}</p>
              <StagePill status={project.status} />
              <div className="atlas-map-popup__actions">
                <button type="button" className="atlas-map-popup__back" onClick={onClose}>
                  Back to map
                </button>
                <Link href={`/solutions/${project.slug}`} className="atlas-map-popup__continue">
                  View solution →
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
