import type {
  AudioTilePreview,
  ContributorPreview,
  EpisodePreview,
  ProgrammePreview,
  SolutionPreview,
  StoryPreview,
  VideoPreview,
} from './types'

const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/64/64`
const img = (seed: string, w = 600, h = 450) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const stories: StoryPreview[] = [
  {
    slug: 'northern-uganda-water-scarcity',
    category: 'Climate Change',
    title: 'Communities in Northern Uganda Are Adapting to Long-Term Water Scarcity',
    excerpt:
      'A field report on how drought conditions are reshaping daily life, forcing communities to develop shared water systems and survival strategies.',
    image: img('uganda-water2'),
    author: { name: 'Mary Brown', role: 'Activist', avatar: avatar('uganda-water2-author') },
  },
  {
    slug: 'farming-seasons-east-africa',
    category: 'Agriculture',
    title: 'How Changing Climate Patterns Are Reshaping Farming Seasons Across East Africa',
    excerpt: 'Rainfall once guided planting cycles. Farmers describe what it means to plant on instinct alone.',
    image: img('farming-season2'),
    author: { name: 'Daniel Okello', role: 'Field Journalist', avatar: avatar('farming-season2-author') },
  },
  {
    slug: 'cooperative-wells-drought',
    category: 'Water',
    title: 'The Cooperative Wells Keeping a Region Hydrated Through Drought',
    excerpt: 'How twelve villages pooled labour and savings to dig wells deep enough to outlast the dry season.',
    image: img('wells'),
    author: { name: 'Grace Nabirye', role: 'Researcher', avatar: avatar('wells-author') },
  },
  {
    slug: 'wetland-restoration',
    category: 'Biodiversity',
    title: 'Restoring the Wetlands That Once Fed a Region',
    excerpt: 'A community-led wetland restoration project is reviving fish stocks and reducing flood risk.',
    image: img('wetland2'),
    author: { name: 'Patricia Auma', role: 'Photographer', avatar: avatar('wetland2-author') },
  },
  {
    slug: 'solar-micro-grids',
    category: 'Renewable Energy',
    title: 'Solar Micro-Grids Are Reaching the Villages the National Grid Forgot',
    excerpt: 'Off-grid solar cooperatives are powering schools, clinics, and small businesses across rural districts.',
    image: img('solar-village'),
    author: { name: 'Brian Tumusiime', role: 'Field Journalist', avatar: avatar('solar-village-author') },
  },
  {
    slug: 'lake-victoria-plastic',
    category: 'Pollution',
    title: "Lake Victoria's Plastic Problem, Seen From a Fishing Canoe",
    excerpt: "Fishers describe nets that come up heavier with waste than with fish — and what they're doing about it.",
    image: img('lake-plastic'),
    author: { name: 'Esther Nakato', role: 'Documentarian', avatar: avatar('lake-plastic-author') },
  },
  {
    slug: 'who-pays-when-rains-dont-come',
    category: 'Climate Justice',
    title: "Who Pays When the Rains Don't Come?",
    excerpt: 'Smallholder farmers are demanding a seat at the table in national climate adaptation planning.',
    image: img('justice'),
    author: { name: 'Samuel Were', role: 'Policy Writer', avatar: avatar('justice-author') },
  },
  {
    slug: 'teenagers-mapping-flood-risk',
    category: 'Youth Voices',
    title: 'The Teenagers Mapping Flood Risk With Their Phones',
    excerpt: "A youth-led citizen science project is building Uganda's most detailed local flood-risk maps.",
    image: img('youth-map'),
    author: { name: 'Ritah Kobusingye', role: 'Youth Reporter', avatar: avatar('youth-map-author') },
  },
  {
    slug: 'community-forests-deforestation',
    category: 'Conservation',
    title: 'Inside the Community Forests Pushing Back Deforestation',
    excerpt: 'Local forest committees are reversing decades of logging — one replanted hillside at a time.',
    image: img('forest-comm'),
    author: { name: 'Daniel Okello', role: 'Field Journalist', avatar: avatar('forest-comm-author') },
  },
  {
    slug: 'adaptation-or-survival',
    category: 'Opinion',
    title: "We Keep Calling It Adaptation. Maybe It's Just Survival.",
    excerpt: "An essay on the language we use to describe communities responding to a crisis they didn't cause.",
    image: img('opinion1'),
    author: { name: 'Mary Brown', role: 'Activist', avatar: avatar('opinion1-author') },
  },
  {
    slug: 'market-women-briquettes',
    category: 'Sustainability',
    title: 'The Market Women Who Switched an Entire Town Off Charcoal',
    excerpt: "A cooperative of market vendors built a briquette business that's changing how a town cooks.",
    image: img('briquette'),
    author: { name: 'Grace Nabirye', role: 'Researcher', avatar: avatar('briquette-author') },
  },
  {
    slug: 'climate-displaced-settlement',
    category: 'Climate Change',
    title: 'Six Months Inside a Climate-Displaced Settlement',
    excerpt: 'A longform photo essay documenting daily life after a community lost its land to erosion.',
    image: img('displaced'),
    author: { name: 'Patricia Auma', role: 'Photographer', avatar: avatar('displaced-author') },
  },
]

export const featuredStory: StoryPreview = {
  slug: 'climate-stories-across-africa',
  category: 'Climate Change',
  title: 'Climate Stories, Ideas, and Solutions from Across Africa',
  excerpt: undefined,
  image: img('eco-moss', 900, 650),
  author: { name: 'Mary Brown', role: 'Activist', avatar: avatar('mary-brown') },
  readTime: '6 MIN READ',
  featured: true,
}

export const homeAudioTiles: AudioTilePreview[] = [
  { meta: 'EP. 12 · 24 MIN', title: 'Drought, Debt, and the Will to Replant', bgClass: 'bg-magenta' },
  { meta: 'EP. 11 · 19 MIN', title: 'What the River Took With It', bgClass: 'bg-forest' },
  { meta: 'EP. 10 · 21 MIN', title: 'Solar on the Savannah', bgClass: 'bg-teal' },
]

export const solutions: SolutionPreview[] = [
  {
    slug: 'solar-micro-grids',
    category: 'Renewable Energy',
    title: 'Solar Micro-Grids',
    description:
      "Off-grid solar cooperatives powering schools, clinics, and small businesses in areas the national grid hasn't reached.",
    stat: '8 community sites',
  },
  {
    slug: 'drought-resistant-seed-banks',
    category: 'Agriculture',
    title: 'Drought-Resistant Seed Banks',
    description:
      'Farmer-run seed banks preserving and distributing climate-resilient crop varieties bred for shorter, unpredictable seasons.',
    stat: '14 districts',
  },
  {
    slug: 'cooperative-well-networks',
    category: 'Water',
    title: 'Cooperative Well Networks',
    description: 'Shared labour and savings schemes funding wells deep enough to outlast extended dry seasons.',
    stat: '40+ villages',
  },
  {
    slug: 'community-forest-committees',
    category: 'Conservation',
    title: 'Community Forest Committees',
    description:
      'Local governance structures that have reversed decades of logging through replanting and patrol programmes.',
    stat: '12 forest reserves',
  },
  {
    slug: 'plastic-to-brick-cooperatives',
    category: 'Pollution',
    title: 'Plastic-to-Brick Cooperatives',
    description:
      'Fisher cooperatives converting collected lake plastic into construction material, funding further clean-up.',
    stat: '3 lakeside towns',
  },
  {
    slug: 'briquette-micro-enterprises',
    category: 'Sustainability',
    title: 'Briquette Micro-Enterprises',
    description: 'Market-women-led businesses producing charcoal alternatives from agricultural waste.',
    stat: 'Town-wide adoption',
  },
]

export const videos: VideoPreview[] = [
  {
    slug: 'what-the-lake-remembers',
    type: 'Documentary',
    title: 'What the Lake Remembers: Fishing Communities on a Changing Shoreline',
    duration: '24:10',
    featured: true,
  },
  { slug: 'youth-solar-workshop', type: 'Field Report', title: "Inside Uganda's First Youth-Run Solar Workshop", duration: '9:42' },
  { slug: 'women-rebuilding-forest', type: 'Community Spotlight', title: 'The Women Rebuilding a Forest, Tree by Tree', duration: '12:05' },
  { slug: 'climate-scientist-interview', type: 'Interview', title: "A Climate Scientist on What East Africa's Data Is Showing", duration: '18:30' },
  { slug: 'flood-risk-cartographer', type: 'Short', title: 'Three Minutes With a Flood-Risk Cartographer, Age 17', duration: '3:15' },
  { slug: 'rain-fed-farm', type: 'Educational', title: 'How a Rain-Fed Farm Reads the Sky', duration: '7:48' },
  { slug: 'cooperative-well-drought', type: 'Field Report', title: 'The Cooperative Well That Outlasted the Drought', duration: '11:20' },
  { slug: 'charcoal-to-briquette', type: 'Documentary', title: 'Charcoal to Briquette: A Town Changes How It Cooks', duration: '21:55' },
]

export const episodes: EpisodePreview[] = [
  { slug: 'drought-debt-replant', num: 12, title: 'Drought, Debt, and the Will to Replant', series: 'Youth Climate Dispatch', duration: '24:10' },
  { slug: 'what-the-river-took', num: 11, title: 'What the River Took With It', series: 'Field Journalists Diaries', duration: '19:42' },
  { slug: 'solar-on-savannah', num: 10, title: 'Solar on the Savannah', series: 'Solutions in Motion', duration: '21:05' },
  { slug: 'wells-we-dug-together', num: 9, title: 'The Wells We Dug Together', series: 'Youth Climate Dispatch', duration: '16:30' },
  { slug: 'mapping-flood-risk-seventeen', num: 8, title: 'Mapping Flood Risk at Seventeen', series: 'Youth Climate Dispatch', duration: '14:15' },
  { slug: 'scientist-explains-numbers', num: 7, title: 'A Scientist Explains the Numbers', series: 'Field Journalists Diaries', duration: '27:48' },
]

export const programmes: ProgrammePreview[] = [
  {
    slug: 'storytelling-academy',
    eyebrow: '8-week course · Cohort-based',
    title: 'Storytelling Academy',
    description:
      'A structured course in climate journalism — from field interviewing to long-form narrative writing — for new and emerging contributors.',
    bgClass: 'bg-maroon',
  },
  {
    slug: 'youth-reporters',
    eyebrow: 'Ongoing · Ages 16–24',
    title: 'Youth Reporters',
    description:
      'Hands-on mentorship for young people reporting on climate issues in their own communities, with editorial support every step of the way.',
    bgClass: 'bg-magenta',
  },
  {
    slug: 'climate-voices',
    eyebrow: 'Rolling submissions · Audio + written',
    title: 'Climate Voices',
    description:
      'A platform for first-person essays and recorded testimony from people directly affected by climate change.',
    bgClass: 'bg-forest',
  },
  {
    slug: 'young-guardians',
    eyebrow: 'School term · Ages 10–15',
    title: 'Young Guardians',
    description:
      'A schools programme introducing climate literacy and basic storytelling skills to upper-primary and early-secondary students.',
    bgClass: 'bg-gold',
  },
  {
    slug: 'research-hub',
    eyebrow: 'Quarterly · Researchers & students',
    title: 'Research Hub',
    description:
      'A space for translating academic climate research into accessible explainers, in partnership with university research groups.',
    bgClass: 'bg-lime2',
  },
  {
    slug: 'audio-stories',
    eyebrow: 'Ongoing · Podcast production',
    title: 'Audio Stories',
    description:
      'Training and equipment support for community reporters producing field-recorded audio stories and podcast episodes.',
    bgClass: 'bg-teal',
  },
]

export const contributors: ContributorPreview[] = [
  { slug: 'mary-brown', name: 'Mary Brown', role: 'Activist', bio: 'Climate justice, water scarcity', avatar: avatar('mary-brown') },
  { slug: 'daniel-okello', name: 'Daniel Okello', role: 'Field Journalist', bio: 'Agriculture, rural livelihoods', avatar: avatar('daniel-okello') },
  { slug: 'grace-nabirye', name: 'Grace Nabirye', role: 'Researcher', bio: 'Biodiversity, wetlands', avatar: avatar('grace-nabirye') },
  { slug: 'patricia-auma', name: 'Patricia Auma', role: 'Photographer', bio: 'Photo essays, displacement', avatar: avatar('patricia-auma') },
  { slug: 'brian-tumusiime', name: 'Brian Tumusiime', role: 'Field Journalist', bio: 'Renewable energy', avatar: avatar('brian-tumusiime') },
  { slug: 'esther-nakato', name: 'Esther Nakato', role: 'Documentarian', bio: 'Pollution, Lake Victoria', avatar: avatar('esther-nakato') },
  { slug: 'samuel-were', name: 'Samuel Were', role: 'Policy Writer', bio: 'Climate justice, policy', avatar: avatar('samuel-were') },
  { slug: 'ritah-kobusingye', name: 'Ritah Kobusingye', role: 'Youth Reporter', bio: 'Youth voices, mapping', avatar: avatar('ritah-kobusingye') },
]

export const impactStats = [
  { num: '50+', label: 'Young climate storytellers trained' },
  { num: '100+', label: 'Climate stories and articles published' },
]

export const categoryFilters = {
  home: ['All', 'Climate Change', 'Water', 'Agriculture', 'Biodiversity', 'Energy', 'Opinion'],
  stories: ['All', 'Solutions', 'Climate Change', 'Water', 'Biodiversity', 'Pollution', 'Agriculture', 'Energy', 'Opinion'],
  solutions: ['All Solutions', 'Energy', 'Agriculture', 'Water', 'Conservation', 'Pollution', 'Sustainability'],
  watch: ['All', 'Documentaries', 'Field Reports', 'Interviews', 'Community Spotlights', 'Educational'],
  contributors: ['All', 'Journalists', 'Researchers', 'Photographers', 'Filmmakers', 'Youth Reporters', 'Policy Writers'],
}

export const partnerOrganisations = [
  'Greenline Africa',
  'Kampala Climate Lab',
  'Makerere Env. Society',
  'Youth4Climate UG',
  'Wetlands Trust',
  'SolarWorks Coop',
]

export const communityProjects = [
  { title: 'Community Forest Watch', excerpt: 'Volunteer-run patrol and replanting network across 12 forest reserves.' },
  { title: 'Flood Risk Mapping', excerpt: 'A youth-led citizen science project building hyper-local flood risk maps.' },
  { title: 'Cooperative Well Fund', excerpt: 'A community savings scheme financing new wells in drought-prone districts.' },
]

export const videoSeries: AudioTilePreview[] = [
  { meta: 'SEASON 2 · 8 FILMS', title: 'Youth Climate Dispatch: On Camera', bgClass: 'bg-magenta' },
  { meta: 'SEASON 1 · 6 FILMS', title: 'Field Journalists Diaries', bgClass: 'bg-forest' },
  { meta: 'SEASON 1 · 5 FILMS', title: 'Solutions in Motion', bgClass: 'bg-teal' },
]

export const podcastSeries: (AudioTilePreview & { description: string })[] = [
  {
    meta: '32 EPISODES',
    title: 'Youth Climate Dispatch',
    description: 'A youth-led podcast series featuring young storytellers reporting from their regions.',
    bgClass: 'bg-magenta',
  },
  {
    meta: '18 EPISODES',
    title: 'Field Journalists Diaries',
    description: "Reporters narrate what didn't make it into the published story.",
    bgClass: 'bg-forest',
  },
  {
    meta: '22 EPISODES',
    title: 'Solutions in Motion',
    description: 'Short audio profiles of the people building climate solutions today.',
    bgClass: 'bg-teal',
  },
]
