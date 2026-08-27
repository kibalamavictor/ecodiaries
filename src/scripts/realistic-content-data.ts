/**
 * Curated launch content for EcoDiaries — Africa-specific, documentary tone.
 * Used by seed-realistic-content.ts. Maps UX concepts onto Payload fields:
 * - Stage → solutionStatus
 * - Milestones → impact-updates
 * - Lead practitioner → organizations.team
 * - Pull quote → thesis + quote block in body
 */

import { paragraphsToLexical } from './launch-content'

export const REALISTIC_CATEGORIES = [
  { name: 'Agriculture', slug: 'agriculture', color: '#6FA300' },
  { name: 'Water', slug: 'water', color: '#00AB45' },
  { name: 'Biodiversity', slug: 'biodiversity', color: '#014104' },
  { name: 'Pollution', slug: 'pollution', color: '#58001E' },
  { name: 'Renewable Energy', slug: 'renewable-energy', color: '#FFE44D' },
  { name: 'Climate Justice', slug: 'climate-justice', color: '#C51353' },
  { name: 'Youth Voices', slug: 'youth-voices', color: '#B6F101' },
  { name: 'Climate Solutions', slug: 'climate-solutions', color: '#00AB45' },
  { name: 'Community Stories', slug: 'community-stories', color: '#0B3E1F' },
] as const

export const REALISTIC_ORGANIZATIONS = [
  {
    name: 'Kigezi Highland Seed Keepers',
    slug: 'kigezi-highland-seed-keepers',
    type: 'cooperative' as const,
    tagline: 'Community seed banks restoring drought-tolerant varieties across the Ugandan highlands.',
    hqLocation: 'Kabale, Uganda',
    regions: ['east-africa'] as const,
    focusAreas: ['agriculture'] as const,
    team: [{ name: 'Grace Ninsiima', role: 'Lead Agronomist & Cooperative Chair' }],
  },
  {
    name: 'Lake Victoria Wetland Trust',
    slug: 'lake-victoria-wetland-trust',
    type: 'ngo' as const,
    tagline: 'Protecting papyrus wetlands and community fisheries on the Kenyan lakeshore.',
    hqLocation: 'Kisumu, Kenya',
    regions: ['east-africa'] as const,
    focusAreas: ['biodiversity', 'water'] as const,
    team: [{ name: 'Otieno Okoth', role: 'Field Conservation Lead' }],
  },
  {
    name: 'Volta Solar Collective',
    slug: 'volta-solar-collective',
    type: 'social-enterprise' as const,
    tagline: 'Youth-built mini-grids bringing reliable power to off-grid communities in Ghana.',
    hqLocation: 'Ho, Ghana',
    regions: ['west-africa'] as const,
    focusAreas: ['energy'] as const,
    team: [{ name: 'Ama Mensah', role: 'Founding Engineer & Project Lead' }],
  },
  {
    name: 'Dodoma Drylands Initiative',
    slug: 'dodoma-drylands-initiative',
    type: 'community' as const,
    tagline: 'Sand dams and soil restoration for semi-arid villages in central Tanzania.',
    hqLocation: 'Dodoma, Tanzania',
    regions: ['east-africa'] as const,
    focusAreas: ['water', 'agriculture'] as const,
    team: [{ name: 'Neema Mwamba', role: 'Community Water Coordinator' }],
  },
  {
    name: 'Nyungwe Edge Guardians',
    slug: 'nyungwe-edge-guardians',
    type: 'ngo' as const,
    tagline: 'Indigenous tree corridors linking farms to Nyungwe Forest in Rwanda.',
    hqLocation: 'Huye, Rwanda',
    regions: ['east-africa'] as const,
    focusAreas: ['biodiversity'] as const,
    team: [{ name: 'Jean-Claude Habimana', role: 'Reforestation Programme Lead' }],
  },
  {
    name: 'Dakar Waste Commons',
    slug: 'dakar-waste-commons',
    type: 'cooperative' as const,
    tagline: 'Neighbourhood plastic recovery and circular materials work in urban Senegal.',
    hqLocation: 'Dakar, Senegal',
    regions: ['west-africa', 'sahel'] as const,
    focusAreas: ['pollution', 'climate-justice'] as const,
    team: [{ name: 'Fatou Diop', role: 'Cooperative Director' }],
  },
]

export const REALISTIC_SOLUTIONS = [
  {
    title: 'Highland Seed Banks Against Erratic Rains',
    slug: 'uganda-highland-seed-banks',
    orgSlug: 'kigezi-highland-seed-keepers',
    country: 'Uganda',
    location: 'Western Uganda',
    locationName: 'Kabale District',
    sectors: ['agriculture'] as const,
    solutionStatus: 'scaling' as const,
    categorySlug: 'agriculture',
    thesis:
      '"When the rains fail twice in a season, the seed bank is what keeps families planting again." — Grace Ninsiima',
    summary:
      'Twelve village seed banks across Kabale District now store drought-tolerant beans, sorghum, and indigenous potato varieties selected by farmers themselves. After three consecutive irregular seasons, participating households report fewer total crop failures and faster replanting cycles. The model is expanding into neighbouring districts with district agriculture office support.',
    keyImpact: [{ label: 'Households with secure seed access', value: '2,400', unit: 'farming households' }],
    statHighlight: '2,400 households with drought-tolerant seed access',
    partnerOrgs: [{ name: 'Kabale District Agriculture Office' }, { name: 'Rwenzori Farmers Alliance' }],
    coordinates: { lat: -1.249, lng: 29.99 },
    milestones: [
      { date: '2022-03-15', title: 'First community seed bank opened in Bubare', metric: { label: 'Varieties stored', value: '18' } },
      { date: '2023-11-02', title: 'District partnership formalised for seed certification', metric: { label: 'Banks active', value: '8' } },
      { date: '2025-06-20', title: 'Network reached 2,400 households across 12 banks', metric: { label: 'Households', value: '2400' } },
    ],
    body: paragraphsToLexical(
      'In Kabale’s steep highlands, planting calendars that once followed the long and short rains no longer hold. Farmers describe seasons that arrive late, leave early, or dump rain in short violent bursts that wash seed downhill.',
      '> "When the rains fail twice in a season, the seed bank is what keeps families planting again."',
      'Grace Ninsiima, lead agronomist with the Kigezi Highland Seed Keepers, co-designed the banks with women’s farming groups who already exchanged seed informally. Each bank is managed by a locally elected committee, with germination tests and community distribution rules written in Rukiga and English.',
      'The verified impact so far is practical: households that lost a first planting can draw replacement seed within days instead of walking markets for expensive hybrid stock that may not suit highland soils.',
    ),
  },
  {
    title: 'Papyrus Wetlands Restoring Lake Edge Fisheries',
    slug: 'kenya-papyrus-wetland-corridors',
    orgSlug: 'lake-victoria-wetland-trust',
    country: 'Kenya',
    location: 'Nyanza',
    locationName: 'Kisumu County lakeshore',
    sectors: ['biodiversity'] as const,
    solutionStatus: 'established' as const,
    categorySlug: 'biodiversity',
    thesis:
      '"The fish returned when the papyrus returned — the lake edge is a living filter, not empty shoreline." — Otieno Okoth',
    summary:
      'Along Kisumu’s lakeshore, community-managed papyrus corridors have reversed years of wetland clearance for informal settlement and agriculture. Water clarity and juvenile fish nursery habitat improved measurably within two seasons of restoration. Beach management units now treat wetland strips as protected commons with clear harvest rules for crafts and fodder.',
    keyImpact: [{ label: 'Wetland shoreline restored', value: '18', unit: 'kilometres' }],
    statHighlight: '18 km of papyrus shoreline restored',
    partnerOrgs: [{ name: 'Kisumu Beach Management Units Network' }, { name: 'Winam Gulf Research Station' }],
    coordinates: { lat: -0.0917, lng: 34.768 },
    milestones: [
      { date: '2021-05-10', title: 'Pilot corridor planted at Dunga Beach', metric: { label: 'Km restored', value: '2' } },
      { date: '2023-02-28', title: 'County by-law recognising community wetland commons', metric: { label: 'BMUs enrolled', value: '9' } },
      { date: '2025-09-12', title: 'Eighteen kilometres under community protection', metric: { label: 'Km restored', value: '18' } },
    ],
    body: paragraphsToLexical(
      'For decades, papyrus beds around Winam Gulf were treated as wasted land — cleared for housing, grazed bare, or burned. Fishers noticed the catch thinning first among the juvenile tilapia that once sheltered in the roots.',
      '> "The fish returned when the papyrus returned — the lake edge is a living filter, not empty shoreline."',
      'Otieno Okoth’s team works with beach management units to map intact stands, replant gaps with community nurseries, and negotiate buffer zones that still allow craft harvesting without cutting the filter strip to bare mud.',
    ),
  },
  {
    title: 'Youth Mini-Grids Lighting Off-Grid Volta Villages',
    slug: 'ghana-volta-youth-minigrids',
    orgSlug: 'volta-solar-collective',
    country: 'Ghana',
    location: 'Volta Region',
    locationName: 'Ho West District',
    sectors: ['energy'] as const,
    solutionStatus: 'scaling' as const,
    categorySlug: 'renewable-energy',
    thesis:
      '"We did not wait for the national grid — we built power that our own technicians can maintain." — Ama Mensah',
    summary:
      'A youth-led solar collective has installed community mini-grids serving clinics, schools, and household clusters across Ho West. Local technicians trained through the programme handle maintenance, reducing downtime that previously lasted weeks after inverter failures. The model is now being replicated in two neighbouring districts with municipal energy desks.',
    keyImpact: [{ label: 'People with first-time reliable electricity', value: '6,800', unit: 'residents' }],
    statHighlight: '6,800 residents with first-time reliable electricity',
    partnerOrgs: [{ name: 'Ho West Municipal Assembly' }, { name: 'Volta Youth Energy Network' }],
    coordinates: { lat: 6.6008, lng: 0.47 },
    milestones: [
      { date: '2022-08-01', title: 'First 40 kW mini-grid commissioned in Abutia', metric: { label: 'Households connected', value: '120' } },
      { date: '2024-01-18', title: 'Technician apprenticeship programme certified by municipal desk', metric: { label: 'Technicians trained', value: '28' } },
      { date: '2025-11-05', title: 'Six communities connected; 6,800 residents served', metric: { label: 'Residents', value: '6800' } },
    ],
    body: paragraphsToLexical(
      'In Abutia and neighbouring settlements, evenings once ended when the sun dropped. Phone charging meant a dusty motorbike ride to town. Clinic refrigerators sat idle.',
      '> "We did not wait for the national grid — we built power that our own technicians can maintain."',
      'Ama Mensah, founding engineer of the Volta Solar Collective, insisted every installation include a paid apprenticeship for local youth. That decision, she argues, is why outages now last hours instead of weeks.',
    ),
  },
  {
    title: 'Sand Dams Anchoring Water Through Dry Seasons',
    slug: 'tanzania-dodoma-sand-dams',
    orgSlug: 'dodoma-drylands-initiative',
    country: 'Tanzania',
    location: 'Central Tanzania',
    locationName: 'Chamwino District',
    sectors: ['water'] as const,
    solutionStatus: 'piloted' as const,
    categorySlug: 'water',
    thesis:
      '"The dam does not create rain — it stores what little we get so gardens survive until the next shower." — Neema Mwamba',
    summary:
      'Seasonal sand dams across Chamwino District store subsurface water in riverbeds that previously ran dry within weeks of rainfall. Women-led water committees manage offtake schedules for household use and kitchen gardens. Early monitoring shows longer water availability into the dry season and reduced walking distances to distant boreholes.',
    keyImpact: [{ label: 'Extra weeks of dry-season water access', value: '11', unit: 'weeks average' }],
    statHighlight: '11 extra weeks of dry-season water access',
    partnerOrgs: [{ name: 'Chamwino District Council' }, { name: 'Central Drylands Water Network' }],
    coordinates: { lat: -6.163, lng: 35.7516 },
    milestones: [
      { date: '2023-04-22', title: 'First sand dam completed at Mvumi Makulu', metric: { label: 'Dams built', value: '1' } },
      { date: '2024-09-30', title: 'Five dams under community water committees', metric: { label: 'Dams built', value: '5' } },
      { date: '2026-01-14', title: 'Dry-season monitoring confirms 11-week average extension', metric: { label: 'Weeks gained', value: '11' } },
    ],
    body: paragraphsToLexical(
      'Chamwino’s seasonal rivers can roar for a week after storms and then vanish into sand. Families used to walk hours for borehole water once surface pools disappeared.',
      '> "The dam does not create rain — it stores what little we get so gardens survive until the next shower."',
      'Neema Mwamba coordinates construction with masons from the villages themselves, using locally quarried stone and labour contributions timed around farming calendars.',
    ),
  },
  {
    title: 'Farm–Forest Corridors Buffering Nyungwe Edge',
    slug: 'rwanda-nyungwe-edge-corridors',
    orgSlug: 'nyungwe-edge-guardians',
    country: 'Rwanda',
    location: 'Southern Rwanda',
    locationName: 'Nyamagabe District',
    sectors: ['biodiversity'] as const,
    solutionStatus: 'scaling' as const,
    categorySlug: 'biodiversity',
    thesis:
      '"Trees on the farm edge are not decoration — they are the buffer that keeps the forest and the harvest both alive." — Jean-Claude Habimana',
    summary:
      'Indigenous tree corridors planted along farm edges bordering Nyungwe Forest reduce human–wildlife conflict while restoring habitat connectivity. Participating farmers receive seedlings, pruning training, and access to non-timber products from the corridor strips. Early camera-trap data shows increased small-mammal movement between forest fragments and farm edges.',
    keyImpact: [{ label: 'Indigenous trees established on farm edges', value: '185,000', unit: 'trees' }],
    statHighlight: '185,000 indigenous trees on farm–forest edges',
    partnerOrgs: [{ name: 'Nyamagabe District Environment Office' }, { name: 'Nyungwe Community Associations Union' }],
    coordinates: { lat: -2.478, lng: 29.24 },
    milestones: [
      { date: '2021-10-05', title: 'Pilot corridor with 12 cooperatives near Uwinka', metric: { label: 'Trees planted', value: '22000' } },
      { date: '2023-07-19', title: 'District seedling nurseries co-managed with associations', metric: { label: 'Nurseries', value: '6' } },
      { date: '2025-12-01', title: '185,000 trees established across edge farms', metric: { label: 'Trees', value: '185000' } },
    ],
    body: paragraphsToLexical(
      'Farms pressed against Nyungwe’s boundary once meant crop raids, charcoal pressure, and a hard line between people and park. The corridor approach softens that edge with indigenous species farmers choose for fodder, shade, and soil.',
      '> "Trees on the farm edge are not decoration — they are the buffer that keeps the forest and the harvest both alive."',
      'Jean-Claude Habimana’s team measures survival rates plot by plot and adjusts species mixes when drought kills seedlings in the first dry season.',
    ),
  },
  {
    title: 'Neighbourhood Plastic Recovery Routes in Dakar',
    slug: 'senegal-dakar-plastic-commons',
    orgSlug: 'dakar-waste-commons',
    country: 'Senegal',
    location: 'Dakar Region',
    locationName: 'Guédiawaye & Pikine',
    sectors: ['pollution', 'climate-justice'] as const,
    solutionStatus: 'established' as const,
    categorySlug: 'pollution',
    thesis:
      '"We treat plastic as material with an owner in the neighbourhood — not as someone else’s trash." — Fatou Diop',
    summary:
      'In Guédiawaye and Pikine, a cooperative of waste pickers and residents runs scheduled plastic recovery routes with fair-price buyback points. Collected PET and HDPE feed local recyclers instead of canals and the coastline. The programme pairs income security for pickers with measurable reductions in plastic entering drainage channels during rainy season.',
    keyImpact: [{ label: 'Plastic diverted from canals and coast', value: '420', unit: 'tonnes / year' }],
    statHighlight: '420 tonnes of plastic diverted yearly',
    partnerOrgs: [{ name: 'Guédiawaye Municipal Sanitation Desk' }, { name: 'Baie de Hann Coastal Watch' }],
    coordinates: { lat: 14.776, lng: -17.395 },
    milestones: [
      { date: '2020-06-12', title: 'First buyback point opened in Guédiawaye', metric: { label: 'Pickers enrolled', value: '40' } },
      { date: '2022-11-08', title: 'Municipal route permits for cooperative collectors', metric: { label: 'Routes', value: '7' } },
      { date: '2025-08-30', title: 'Annual diversion reached 420 tonnes', metric: { label: 'Tonnes / year', value: '420' } },
    ],
    body: paragraphsToLexical(
      'During the rainy season, plastic bags choke Dakar’s drainage and push floodwater into homes. Informal pickers already recovered value from the waste stream — without recognition, safety gear, or stable prices.',
      '> "We treat plastic as material with an owner in the neighbourhood — not as someone else’s trash."',
      'Fatou Diop’s cooperative negotiated municipal route permits so collectors are no longer harassed as illegal dumpers, and publishes buyback prices weekly so households know what clean, sorted plastic is worth.',
    ),
  },
]

export const REALISTIC_CONTRIBUTORS = [
  {
    name: 'Aïcha Touré',
    slug: 'aicha-toure',
    country: 'Mali',
    role: 'Writer',
    bio: 'Aïcha reports on agricultural adaptation across the Sahel, following farming families through drought years and recovery seasons. She previously edited community radio scripts that translate climate forecasts into Bambara and French.',
    pieces: 7,
    email: 'aicha.toure@ecodiaries.test',
  },
  {
    name: 'Brian Ssempijja',
    slug: 'brian-ssempijja',
    country: 'Uganda',
    role: 'Photographer',
    bio: 'Brian documents urban environmental struggles in Kampala and secondary cities, with a focus on waste workers and shoreline communities. His stills from plastic recovery sites have appeared in regional exhibitions and EcoDiaries field reports.',
    pieces: 11,
    email: 'brian.ssempijja@ecodiaries.test',
  },
  {
    name: 'Wanjiru Kamau',
    slug: 'wanjiru-kamau',
    country: 'Kenya',
    role: 'Filmmaker',
    bio: 'Wanjiru produces community-centred documentaries on forest edges, pastoral routes, and lake fisheries. She trains village youth to operate cameras so stories remain with the people who live them.',
    pieces: 5,
    email: 'wanjiru.kamau@ecodiaries.test',
  },
  {
    name: 'Kwesi Boateng',
    slug: 'kwesi-boateng',
    country: 'Ghana',
    role: 'Researcher',
    bio: 'Kwesi studies decentralised energy access and youth employment in Ghana’s Volta and Northern regions. He partners with EcoDiaries to turn field data into readable explainers for non-specialist audiences.',
    pieces: 9,
    email: 'kwesi.boateng@ecodiaries.test',
  },
  {
    name: 'Nala Abebe',
    slug: 'nala-abebe',
    country: 'Ethiopia',
    role: 'Poet',
    bio: 'Nala writes lyric essays and spoken-word pieces about water memory, displacement, and belonging in the Horn of Africa. Her collaborations with EcoDiaries bring poetic testimony into climate storytelling without softening the facts.',
    pieces: 4,
    email: 'nala.abebe@ecodiaries.test',
  },
  {
    name: 'Thandiwe Moyo',
    slug: 'thandiwe-moyo',
    country: 'Zimbabwe',
    role: 'Writer',
    bio: 'Thandiwe covers community conservation and climate justice across Southern Africa, often embedding with women’s savings groups and land committees. She insists every story name the people who did the work, not only the donors.',
    pieces: 8,
    email: 'thandiwe.moyo@ecodiaries.test',
  },
]

export const REALISTIC_STORIES = [
  {
    title: 'Planting by Memory When the Sahel Calendar Breaks',
    slug: 'sahel-planting-by-memory',
    authorSlug: 'aicha-toure',
    categorySlug: 'agriculture',
    location: 'Ségou Region, Mali',
    publishedAt: '2025-11-12T10:00:00.000Z',
    featured: true,
    excerpt:
      'In villages outside Ségou, elders and young farmers compare notes when rains no longer arrive on the old calendar. Families are mixing early-maturing millet with soil-cover crops and shared seed stores that once felt unnecessary. The story follows one cooperative through a failed first planting and a second chance that depended on neighbourly seed, not market credit.',
  },
  {
    title: 'The Plastic Routes Keeping Kampala’s Channels Clear',
    slug: 'kampala-plastic-recovery-routes',
    authorSlug: 'brian-ssempijja',
    categorySlug: 'pollution',
    location: 'Kampala, Uganda',
    publishedAt: '2026-01-20T09:00:00.000Z',
    featured: true,
    excerpt:
      'Before dawn in Katwe and Bwaise, collectors pull PET and film plastic from drains that flood homes each rainy season. A neighbourhood buyback scheme now pays for sorted material that once clogged channels on the way to Lake Victoria. The report sits with the workers who know every choke point by name and with the municipal desk finally recognising their routes.',
  },
  {
    title: 'Guardians on the Edge of the Community Forest',
    slug: 'kenya-community-forest-guardians',
    authorSlug: 'wanjiru-kamau',
    categorySlug: 'biodiversity',
    location: 'Nyandarua, Kenya',
    publishedAt: '2025-09-03T11:00:00.000Z',
    featured: false,
    excerpt:
      'On the slopes above a Nyandarua community forest, women patrol edges where charcoal pits once opened overnight. They measure seedlings, negotiate grazing calendars, and keep a logbook of illegal cuts that used to go unreported. The forest is smaller than a park but large enough that losing it would mean losing water for the farms below.',
  },
  {
    title: 'After Dark in Ho West: Youth Who Wired Their Own Light',
    slug: 'ghana-youth-wired-their-light',
    authorSlug: 'kwesi-boateng',
    categorySlug: 'youth-voices',
    location: 'Ho West, Ghana',
    publishedAt: '2026-02-14T08:30:00.000Z',
    featured: true,
    excerpt:
      'When the national grid stalled on paper, a crew of young technicians in Ho West built mini-grids village by village. Clinics keep vaccines cold; students revise after sunset; phone charging no longer means a trip to town. This piece follows apprentices who treat every inverter failure as a lesson they refuse to outsource.',
  },
]

export const REALISTIC_PODCAST_SERIES = {
  name: 'Field Notes from the Continent',
  slug: 'field-notes-from-the-continent',
  description:
    'Conversations with practitioners, fishers, farmers, and youth organisers documenting climate response across Africa.',
  type: 'podcast' as const,
}

export const REALISTIC_PODCASTS = [
  {
    title: 'Seed Keepers of the Highlands',
    slug: 'ep-01-seed-keepers-highlands',
    episodeNumber: 1,
    duration: '42 min',
    durationSeconds: 2520,
    publishedAt: '2025-10-08T12:00:00.000Z',
    description:
      'Grace Ninsiima explains how Kabale’s village seed banks are rewriting planting calendars under erratic rains. We hear from committee members who decide who receives seed after a failed first planting.',
    guestName: 'Grace Ninsiima',
    guestRole: 'Guest' as const,
    guestBio: 'Lead Agronomist, Kigezi Highland Seed Keepers, Uganda',
  },
  {
    title: 'Papyrus, Fish, and the Living Lake Edge',
    slug: 'ep-02-papyrus-living-lake-edge',
    episodeNumber: 2,
    duration: '38 min',
    durationSeconds: 2280,
    publishedAt: '2025-12-02T12:00:00.000Z',
    description:
      'Otieno Okoth and Kisumu beach management leaders discuss restoring papyrus corridors as fish nurseries. The episode walks the shoreline where wetland commons replaced cleared mudflats.',
    guestName: 'Otieno Okoth',
    guestRole: 'Guest' as const,
    guestBio: 'Field Conservation Lead, Lake Victoria Wetland Trust, Kenya',
  },
  {
    title: 'Plastic Is a Neighbourhood Material',
    slug: 'ep-03-plastic-neighbourhood-material',
    episodeNumber: 3,
    duration: '45 min',
    durationSeconds: 2700,
    publishedAt: '2026-03-11T12:00:00.000Z',
    description:
      'Fatou Diop on cooperative plastic recovery routes in Guédiawaye and Pikine — fair prices, municipal permits, and keeping canals clear in the rains. Collectors describe what changes when the city stops treating them as illegal.',
    guestName: 'Fatou Diop',
    guestRole: 'Guest' as const,
    guestBio: 'Cooperative Director, Dakar Waste Commons, Senegal',
  },
]

export const REALISTIC_VIDEO_SERIES = {
  name: 'Documented on the Ground',
  slug: 'documented-on-the-ground',
  description: 'Short documentaries filmed with communities leading climate solutions across Africa.',
  type: 'video' as const,
}

export const REALISTIC_VIDEOS = [
  {
    title: 'Light After Sunset: Ho West Mini-Grids',
    slug: 'doc-ho-west-minigrids',
    duration: '24 min',
    durationSeconds: 1440,
    categoryTag: 'Documentary' as const,
    publishedAt: '2025-11-28T15:00:00.000Z',
    featured: true,
    description:
      'A documentary following Ama Mensah’s youth collective as they commission solar mini-grids in Ho West, Ghana. Filmed with apprentices who now maintain the systems they helped install.',
    community: 'Abutia & Ho West youth technicians, Ghana',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    title: 'Edge of Nyungwe: Trees Between Farm and Forest',
    slug: 'doc-nyungwe-edge-corridors',
    duration: '18 min',
    durationSeconds: 1080,
    categoryTag: 'Field Report' as const,
    publishedAt: '2026-01-09T15:00:00.000Z',
    featured: false,
    description:
      'Jean-Claude Habimana walks farm–forest corridors where indigenous trees buffer Nyungwe’s edge in Rwanda. Community associations explain how seedling survival is measured season by season.',
    community: 'Nyamagabe farm–forest associations, Rwanda',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
]

export const REALISTIC_PROGRAMMES = [
  {
    name: 'Storytelling Academy — East Africa Cohort',
    slug: 'storytelling-academy-east-africa-2026',
    cadence: '8-week residential + field mentorship · 18 participants',
    accentColor: 'bg-maroon',
    opportunityType: 'programme' as const,
    featured: true,
    status: 'open' as const,
    applicationOpenDate: '2026-04-01',
    applicationCloseDate: '2026-06-30',
    description:
      'An eight-week storytelling academy hosted in Nairobi with field weeks in Kenya and Uganda, training 18 emerging climate journalists. Focus area: long-form narrative on agricultural adaptation and community conservation. Each participant leaves with a publication-ready story and an assigned EcoDiaries editor.',
    applicationInstructions:
      'Open to writers and multimedia storytellers aged 20–35 based in East Africa. Submit one published or unpublished sample and a 300-word pitch rooted in your community.',
  },
  {
    name: 'Field Reporting Lab — Sahel & West Africa',
    slug: 'field-reporting-lab-sahel-2026',
    cadence: '6-week field lab · 12 participants · Accra base + Sahel placements',
    accentColor: 'bg-forest',
    opportunityType: 'programme' as const,
    featured: true,
    status: 'open' as const,
    applicationOpenDate: '2026-05-15',
    applicationCloseDate: '2026-07-31',
    description:
      'A six-week Field Reporting Lab based in Accra with placements across Ghana and partner sites in Senegal, training 12 reporters in solutions documentation. Focus area: energy access, plastic pollution, and climate justice reporting with verified impact metrics. Participants produce one atlas-ready solution brief and one audio or video package.',
    applicationInstructions:
      'Priority for reporters from West Africa and the Sahel with demonstrated community access. Portfolio of two pieces and a short note on the solution or community you intend to document.',
  },
]

export const REALISTIC_SITE_STATS = [
  { value: '6', label: 'Documented climate solutions across Africa' },
  { value: '6', label: 'Field contributors publishing from the continent' },
  { value: '2', label: 'Open programmes for emerging storytellers' },
]
