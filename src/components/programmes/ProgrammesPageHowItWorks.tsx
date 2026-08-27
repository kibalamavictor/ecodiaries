'use client'

import { ProgrammesHowItWorks } from '@/components/programmes/ProgrammesHowItWorks'
import { ProgrammesHowItWorksDesktop } from '@/components/programmes/ProgrammesHowItWorksDesktop'
import { useIsMdViewport } from '@/lib/hooks/use-is-md-viewport'

export function ProgrammesPageHowItWorks() {
  const isMd = useIsMdViewport()

  if (isMd) {
    return <ProgrammesHowItWorksDesktop />
  }

  return <ProgrammesHowItWorks />
}
