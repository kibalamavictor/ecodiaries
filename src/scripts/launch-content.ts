/** Lexical rich text from plain paragraphs (blank line separated). */
export function paragraphsToLexical(...paragraphs: string[]) {
  const blocks = paragraphs.join('\n\n').split('\n\n').filter(Boolean)
  return {
    root: {
      type: 'root',
      children: blocks.map((para) => {
        if (para.startsWith('> ')) {
          return {
            type: 'quote',
            children: [{ type: 'text', text: para.slice(2), version: 1 }],
            version: 1,
          }
        }
        if (para.startsWith('**') && para.endsWith('**')) {
          return {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: para.slice(2, -2), version: 1 }],
            version: 1,
          }
        }
        return {
          type: 'paragraph',
          children: [{ type: 'text', text: para, version: 1 }],
          version: 1,
        }
      }),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

export const launchProgrammes = [
  {
    name: 'Storytelling Academy',
    slug: 'storytelling-academy',
    cadence: '8-week course · Cohort-based',
    accentColor: 'bg-maroon',
    opportunityType: 'programme' as const,
    featured: true,
    status: 'open' as const,
    description:
      'A structured course in climate journalism, taking new and emerging contributors from field interviewing through to long-form narrative writing. Each cohort works with an assigned editor across the full eight weeks, ending with a publication-ready piece.',
    applicationInstructions:
      'Open to anyone with a story idea and basic writing ability. Priority given to applicants reporting from underserved regions.',
    applicationOpenDate: '2025-03-01',
    applicationCloseDate: '2025-09-30',
  },
  {
    name: 'Youth Reporters',
    slug: 'youth-reporters',
    cadence: 'Ongoing · Ages 16–24',
    accentColor: 'bg-magenta',
    opportunityType: 'programme' as const,
    status: 'open' as const,
    description:
      'Hands-on mentorship for young people reporting on climate issues in their own communities, with editorial support at every stage from pitch to publication.',
    applicationInstructions: 'Ages 16–24. No portfolio required — just a story idea rooted in your own community.',
    applicationOpenDate: '2025-01-15',
    applicationCloseDate: '2025-12-15',
  },
  {
    name: 'Climate Voices',
    slug: 'climate-voices',
    cadence: 'Rolling submissions · Audio + written',
    accentColor: 'bg-forest',
    opportunityType: 'programme' as const,
    status: 'open' as const,
    description:
      'A platform for first-person essays and recorded testimony from people directly affected by climate change — farmers, fisherfolk, displaced families, and frontline community leaders.',
    applicationInstructions: 'Open to anyone with direct, lived experience of a climate impact. No writing experience necessary.',
    applicationOpenDate: '2025-02-01',
    applicationCloseDate: '2025-11-30',
  },
  {
    name: 'Young Guardians',
    slug: 'young-guardians',
    cadence: 'School term · Ages 10–15',
    accentColor: 'bg-gold',
    opportunityType: 'programme' as const,
    status: 'open' as const,
    description:
      'A schools programme introducing climate literacy and basic storytelling skills to upper-primary and early-secondary students, delivered in partnership with participating schools.',
    applicationInstructions: 'Delivered through partner schools — students apply via their school, not individually.',
    applicationOpenDate: '2025-04-01',
    applicationCloseDate: '2025-08-31',
  },
  {
    name: 'Research Hub',
    slug: 'research-hub',
    cadence: 'Quarterly · Researchers & students',
    accentColor: 'bg-lime2',
    opportunityType: 'programme' as const,
    status: 'open' as const,
    description:
      'A space for translating academic climate research into accessible public-facing explainers, run in partnership with university research groups across the region.',
    applicationInstructions: 'Open to researchers, postgraduate students, and academic partners with relevant published or in-progress work.',
    applicationOpenDate: '2025-03-15',
    applicationCloseDate: '2025-10-15',
  },
  {
    name: 'Audio Stories',
    slug: 'audio-stories',
    cadence: 'Ongoing · Podcast production',
    accentColor: 'bg-teal',
    opportunityType: 'programme' as const,
    status: 'open' as const,
    description:
      'Training and equipment support for community reporters producing field-recorded audio stories and podcast episodes, from first interview to final edit.',
    applicationInstructions: 'Open to anyone interested in audio storytelling, no prior production experience required.',
    applicationOpenDate: '2025-01-01',
    applicationCloseDate: '2025-12-31',
  },
  {
    name: 'Climate Justice Reporting Grant',
    slug: 'climate-justice-reporting-grant',
    cadence: 'One-off funding · Up to $2,500',
    accentColor: 'bg-gold',
    opportunityType: 'grant' as const,
    featured: true,
    status: 'open' as const,
    description:
      'Micro-grants for journalists and community reporters documenting climate justice stories in under-covered regions across Africa.',
    applicationInstructions:
      'Submit a one-page pitch, sample work, and a simple budget outline. Open to freelancers and small newsrooms.',
    applicationOpenDate: '2025-05-01',
    applicationCloseDate: '2026-08-31',
  },
  {
    name: 'African Climate Journalism Fellowship',
    slug: 'african-climate-journalism-fellowship',
    cadence: '12 months · Mentored',
    accentColor: 'bg-teal',
    opportunityType: 'fellowship' as const,
    featured: true,
    status: 'open' as const,
    description:
      'A year-long fellowship pairing early-career climate reporters with senior editors for field reporting, publishing, and portfolio development.',
    applicationInstructions:
      'Applicants need two published clips and a fellowship project proposal focused on a specific African climate beat.',
    applicationUrl: 'https://example.org/african-climate-journalism-fellowship/apply',
    applicationOpenDate: '2025-04-15',
    applicationCloseDate: '2026-09-30',
  },
  {
    name: 'Youth Climate Storytelling Summit',
    slug: 'youth-climate-storytelling-summit',
    cadence: '3-day summit · Nairobi',
    accentColor: 'bg-magenta',
    opportunityType: 'event' as const,
    featured: true,
    status: 'open' as const,
    description:
      'A convening for young storytellers, educators, and community media groups to share tools, pitches, and collaborations for climate reporting.',
    applicationInstructions:
      'Register with your name, organisation, and one paragraph on what you hope to learn or contribute.',
    applicationUrl: 'https://example.org/youth-climate-storytelling-summit/register',
    applicationOpenDate: '2025-06-01',
    applicationCloseDate: '2026-07-15',
  },
  {
    name: 'Field Audio Reporting Workshop',
    slug: 'field-audio-reporting-workshop',
    cadence: 'Closed cohort · 2024',
    accentColor: 'bg-forest',
    opportunityType: 'programme' as const,
    status: 'closed' as const,
    description:
      'A completed workshop series on field audio capture and podcast production for community reporters. Archived for reference.',
    applicationInstructions: 'This cohort has closed. Browse open programmes and events for current opportunities.',
    applicationOpenDate: '2024-01-10',
    applicationCloseDate: '2024-03-01',
  },
]

export const launchSolutions = [
  {
    slug: 'solar-micro-grids',
    title: 'Solar Micro-Grids',
    categorySlug: 'renewable-energy',
    statHighlight: '8 community sites',
    summary:
      'Off-grid solar cooperatives are powering schools, clinics, and small businesses in areas the national grid has not reached.',
    body: paragraphsToLexical(
      'Off-grid solar cooperatives are powering schools, clinics, and small businesses in areas the national grid has not reached. Each cooperative pools household to household savings, secures a small initial grant, and trains two of its own members as on-site technicians.',
      '**How a micro-grid gets built**\nEach cooperative of 60 households built a complete micro-grid for under $4,000 in total cost, cutting household energy bills by roughly 70% within the first year.',
    ),
  },
  {
    slug: 'drought-resistant-seed-banks',
    title: 'Drought-Resistant Seed Banks',
    categorySlug: 'agriculture',
    statHighlight: '14 districts',
    summary:
      'Farmer-run seed banks are preserving and distributing crop varieties bred for shorter, less predictable growing seasons.',
    body: paragraphsToLexical(
      'Farmer-run seed banks are preserving and distributing crop varieties bred for shorter, less predictable growing seasons — work that previously depended on unreliable commercial seed supply chains.',
    ),
  },
  {
    slug: 'cooperative-well-networks',
    title: 'Cooperative Well Networks',
    categorySlug: 'water',
    statHighlight: '40+ villages',
    summary: 'Shared labour and savings schemes are funding wells dug deep enough to outlast extended dry seasons.',
    body: paragraphsToLexical(
      'Shared labour and savings schemes are funding wells dug deep enough to outlast extended dry seasons, where shallower hand-dug wells have historically failed.',
    ),
  },
  {
    slug: 'community-forest-committees',
    title: 'Community Forest Committees',
    categorySlug: 'conservation',
    statHighlight: '12 forest reserves',
    summary:
      'Local governance structures have reversed decades of unregulated logging through coordinated replanting and patrol programmes.',
    body: paragraphsToLexical(
      'Local governance structures — committees elected by surrounding villages — have reversed decades of unregulated logging through coordinated replanting and patrol programmes.',
    ),
  },
  {
    slug: 'plastic-to-brick-cooperatives',
    title: 'Plastic-to-Brick Cooperatives',
    categorySlug: 'pollution',
    statHighlight: '3 lakeside towns',
    summary:
      'Fisher cooperatives are converting plastic waste collected from Lake Victoria into construction-grade bricks.',
    body: paragraphsToLexical(
      'Fisher cooperatives are converting plastic waste collected from Lake Victoria into construction-grade bricks, turning a pollution problem into a funding source for further clean-up work.',
    ),
  },
  {
    slug: 'briquette-micro-enterprises',
    title: 'Briquette Micro-Enterprises',
    categorySlug: 'sustainability',
    statHighlight: 'Town-wide adoption',
    summary:
      'Market-women-led businesses are producing charcoal alternatives from agricultural waste.',
    body: paragraphsToLexical(
      'Market-women-led businesses are producing charcoal alternatives from agricultural waste — maize cobs, rice husks, and similar byproducts that would otherwise be discarded or burned.',
    ),
  },
]

export const launchPartners = [
  { name: 'Greenline Africa', description: 'A pan-regional environmental advocacy network connecting grassroots climate organisers across East Africa.' },
  { name: 'Kampala Climate Lab', description: 'A research and innovation lab prototyping low-cost climate adaptation technology with local communities.' },
  { name: 'Makerere Env. Society', description: 'The environmental sciences student society at Makerere University, partnering on the Research Hub programme.' },
  { name: 'Youth4Climate UG', description: 'A youth-led climate advocacy network supporting the Youth Reporters programme community placements.' },
  { name: 'Wetlands Trust', description: 'A conservation NGO focused on wetland restoration and the communities whose livelihoods depend on them.' },
  { name: 'SolarWorks Coop', description: 'A technician training cooperative supporting the Solar Micro-Grids solution with installation and maintenance training.' },
]

export const launchContributors = [
  { name: 'Mary Brown', slug: 'mary-brown', email: 'mary-brown@ecodiaries.test', role: 'Activist', bio: 'Climate justice and water scarcity reporting from Northern Uganda.', expertise: ['Climate justice', 'Water scarcity'] },
  { name: 'Daniel Okello', slug: 'daniel-okello', email: 'daniel-okello@ecodiaries.test', role: 'Field Journalist', bio: 'Reports from rural farming communities on changing seasons and livelihoods.', expertise: ['Agriculture', 'Rural livelihoods'] },
  { name: 'Grace Nabirye', slug: 'grace-nabirye', email: 'grace-nabirye@ecodiaries.test', role: 'Researcher', bio: 'Translates field research on wetland ecosystems into accessible reporting.', expertise: ['Biodiversity', 'Wetlands'] },
  { name: 'Patricia Auma', slug: 'patricia-auma', email: 'patricia-auma@ecodiaries.test', role: 'Photographer', bio: 'Documents climate displacement through long-term embedded photo essays.', expertise: ['Photo essays', 'Displacement'] },
  { name: 'Brian Tumusiime', slug: 'brian-tumusiime', email: 'brian-tumusiime@ecodiaries.test', role: 'Field Journalist', bio: 'Reports on renewable energy cooperatives spreading across rural Uganda.', expertise: ['Renewable energy'] },
  { name: 'Esther Nakato', slug: 'esther-nakato', email: 'esther-nakato@ecodiaries.test', role: 'Documentarian', bio: 'Written and video reporting on plastic pollution in Lake Victoria.', expertise: ['Pollution', 'Lake Victoria'] },
  { name: 'Samuel Were', slug: 'samuel-were', email: 'samuel-were@ecodiaries.test', role: 'Policy Writer', bio: 'Covers climate justice and who gets a say in national adaptation planning.', expertise: ['Climate justice', 'Policy'] },
  { name: 'Ritah Kobusingye', slug: 'ritah-kobusingye', email: 'ritah-kobusingye@ecodiaries.test', role: 'Youth Reporter', bio: 'Youth-led citizen science and flood mapping in her community.', expertise: ['Youth voices', 'Mapping'] },
]

export const launchStories = [
  {
    slug: 'communities-northern-uganda-water-scarcity',
    title: 'Communities in Northern Uganda Are Adapting to Long-Term Water Scarcity',
    categorySlug: 'water',
    authorSlug: 'mary-brown',
    location: 'Northern Uganda',
    readingTime: 5,
    featured: true,
    excerpt:
      'A field report on how drought conditions are reshaping daily life, forcing communities to develop shared water systems, harvesting techniques, and survival strategies.',
    body: paragraphsToLexical(
      'In much of Northern Uganda, water scarcity is no longer a seasonal inconvenience — it has become a permanent feature of daily planning. Rainy seasons that once reliably refilled shallow wells now arrive late, run short, or fail outright.',
      '**Shared systems, shared risk**\nWhere individual households once dug and maintained their own wells, many villages have shifted to cooperative systems: pooled labour to dig deeper wells, shared maintenance funds, and rotating schedules.',
      '> "A well that one family digs alone runs dry in two years now. A well that the whole village digs together lasts through the drought." — Community elder, Northern Uganda',
      'Northern Uganda\'s water scarcity is not easing. What has changed is that the response to it is no longer improvised household by household — it is becoming infrastructure, built collectively, one cooperative well at a time.',
    ),
  },
  {
    slug: 'solar-micro-grids-villages',
    title: 'Solar Micro-Grids Are Reaching the Villages the National Grid Forgot',
    categorySlug: 'renewable-energy',
    authorSlug: 'brian-tumusiime',
    location: 'Rural Uganda',
    readingTime: 4,
    featured: false,
    excerpt:
      'Off-grid solar cooperatives are powering schools, clinics, and small businesses across rural districts the national grid has not reached — and they are being built and maintained locally.',
    body: paragraphsToLexical(
      'For decades, the promise of grid electricity reaching rural Uganda\'s furthest districts has stayed a promise. Solar micro-grids are changing the calculation.',
      '**How a micro-grid actually gets built**\nThe model spreading fastest is a cooperative one: households pool savings, apply for a modest start-up grant, and commit two members to formal technician training before installation.',
      'What started as a workaround for grid access delays is starting to look like a genuine alternative to waiting for the grid at all.',
    ),
  },
  {
    slug: 'lake-victoria-plastic-fishing-canoe',
    title: "Lake Victoria's Plastic Problem, Seen From a Fishing Canoe",
    categorySlug: 'pollution',
    authorSlug: 'esther-nakato',
    location: 'Lake Victoria',
    readingTime: 4,
    featured: false,
    excerpt:
      'Fishers describe nets that come up heavier with waste than with fish — and the cooperative clean-up effort turning collected plastic into a livelihood instead of a loss.',
    body: paragraphsToLexical(
      'Ask a fisher on Lake Victoria how their catch has changed and the answer increasingly is not about fish at all. It is about what else comes up in the net.',
      '**Turning the problem into the funding**\nCollected plastic is sorted, shredded, and compressed into construction-grade bricks — sold locally for small building projects.',
      '> "We used to throw the plastic back because there was nowhere for it to go. Now it pays for the diesel to get back out on the water." — Cooperative member',
    ),
  },
  {
    slug: 'teenagers-mapping-flood-risk',
    title: 'The Teenagers Mapping Flood Risk With Their Phones',
    categorySlug: 'youth-voices',
    authorSlug: 'ritah-kobusingye',
    location: 'Uganda',
    readingTime: 4,
    featured: false,
    excerpt:
      "A youth-led citizen science project is building some of Uganda's most detailed local flood-risk maps — using nothing more than smartphones and door-to-door surveying.",
    body: paragraphsToLexical(
      'When flooding hit a cluster of villages two years in a row, a group of teenagers did not wait for an official risk assessment. They started building their own.',
      '**A map built from the ground up**\nUsing basic smartphone GPS and a simple shared survey form, the group has spent months walking affected areas and recording flood-line markers from residents\' own memories.',
      'What started as a response to repeated flooding has become something closer to community infrastructure — a living, locally-built map that official planning has started to actually use.',
    ),
  },
  {
    slug: 'community-forests-deforestation',
    title: 'Inside the Community Forests Pushing Back Deforestation',
    categorySlug: 'conservation',
    authorSlug: 'daniel-okello',
    location: 'Eastern Uganda',
    readingTime: 4,
    featured: false,
    excerpt:
      'Local forest committees are reversing decades of logging — one replanted hillside at a time, governed entirely by the villages surrounding each reserve.',
    body: paragraphsToLexical(
      'Twelve forest reserves across the region share a common feature: each is now governed not by a distant authority, but by a committee elected from the villages immediately surrounding it.',
      '**From open access to managed access**\nThe shift to community forest committees changed the incentive structure: the people setting harvesting rules are the same people who live with the consequences of the forest disappearing.',
      '> "When the forest belonged to no one, everyone took what they could before someone else did. When it belongs to the village, that calculation changes." — Forest committee member',
    ),
  },
]

export const launchVideos = [
  {
    slug: 'wetlands-restoration-documentary',
    title: 'Wetlands Restoration: A Community Documentary',
    categoryTag: 'Documentary' as const,
    duration: '12 min',
    featured: true,
    description: 'Following wetland restoration work led by local conservation committees across Eastern Uganda.',
  },
  {
    slug: 'solar-cooperative-field-report',
    title: 'Inside a Solar Cooperative Field Report',
    categoryTag: 'Field Report' as const,
    duration: '8 min',
    featured: false,
    description: 'A field report from a rural solar micro-grid cooperative powering a village clinic and school.',
  },
]

export const E2E_ADMIN_EMAIL = 'e2e-admin@ecodiaries.test'
export const E2E_ADMIN_PASSWORD = 'E2eAdminPass123!'
export const E2E_CONTRIBUTOR_EMAIL = 'e2e-contributor@ecodiaries.test'
export const E2E_CONTRIBUTOR_PASSWORD = 'E2eContributorPass123!'
