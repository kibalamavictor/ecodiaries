import { CommunityProjectCard, type CommunityProject } from '@/components/community/CommunityProjectCard'

function projectsInPairs(projects: CommunityProject[]): CommunityProject[][] {
  const pairs: CommunityProject[][] = []
  for (let i = 0; i < projects.length; i += 2) {
    pairs.push(projects.slice(i, i + 2))
  }
  return pairs
}

type CommunityMobileProjectsProps = {
  projects: CommunityProject[]
}

export function CommunityMobileProjects({ projects }: CommunityMobileProjectsProps) {
  if (!projects.length) return null

  const columns = projectsInPairs(projects)

  return (
    <section className="community-mobile-section community-mobile-section--paper">
      <div className="community-mobile-page__body">
        <section className="mobile-stories-category">
          <h2 className="mobile-stories-category__title">Community Projects</h2>
          <div className="mobile-stories-2row-scroll scroll-edge-fade scrollbar-hide">
            {columns.map((column, index) => (
              <div key={`community-projects-${index}`} className="mobile-stories-2row-column">
                {column.map((project) => (
                  <CommunityProjectCard key={project.title} project={project} />
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
