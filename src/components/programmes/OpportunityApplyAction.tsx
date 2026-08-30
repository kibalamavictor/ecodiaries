'use client'

import { ProgrammeApplicationWizard } from '@/components/forms/ProgrammeApplicationWizard'
import { normalizeApplicationUrl } from '@/lib/programmes/application'
import { opportunityApplyLabel } from '@/lib/programmes/labels'
import type { OpportunityType } from '@/lib/programmes/types'

type OpportunityApplyActionProps = {
  title: string
  opportunityType: OpportunityType
  applicationUrl?: string | null
  triggerClassName: string
}

export function OpportunityApplyAction({
  title,
  opportunityType,
  applicationUrl,
  triggerClassName,
}: OpportunityApplyActionProps) {
  const label = opportunityApplyLabel(opportunityType)
  const externalUrl = normalizeApplicationUrl(applicationUrl)

  if (externalUrl) {
    return (
      <a href={externalUrl} className={triggerClassName} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    )
  }

  return (
    <ProgrammeApplicationWizard
      programmeName={title}
      triggerClassName={triggerClassName}
      triggerLabel={label}
    />
  )
}
