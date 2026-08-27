import { ContributorsApplyLink } from '@/components/contributors/ContributorsApplyLink'
import { MagPageIntro } from '@/components/magazine/MagPageIntro'

export function ContributorHero() {
  return (
    <div className="mag-section" style={{ paddingTop: 12, paddingBottom: 8 }}>
      <MagPageIntro
        eyebrow="Contributors"
        title="The voices behind every dispatch"
        lede="Writers, photographers, filmmakers, researchers, and poets documenting climate stories across Africa."
      >
        <div className="mag-actions">
          <ContributorsApplyLink className="mag-btn">Become a contributor</ContributorsApplyLink>
        </div>
      </MagPageIntro>
    </div>
  )
}
