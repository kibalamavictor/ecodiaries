/** Shared test content definitions for seed-test-content.ts */

export const TEST_CATEGORIES = [
  { name: 'Climate Change', slug: 'climate-change', color: '#2d6a4f' },
  { name: 'Water', slug: 'water', color: '#1e88e5' },
  { name: 'Agriculture', slug: 'agriculture', color: '#f9a825' },
  { name: 'Biodiversity', slug: 'biodiversity', color: '#6a4c93' },
  { name: 'Energy', slug: 'energy', color: '#e65100' },
  { name: 'Pollution', slug: 'pollution', color: '#546e7a' },
  { name: 'Youth Voices', slug: 'youth-voices', color: '#c62828' },
  { name: 'Solutions', slug: 'solutions', color: '#00695c' },
  { name: 'Policy', slug: 'policy', color: '#37474f' },
  { name: 'Opinion', slug: 'opinion', color: '#4e342e' },
] as const

export const CONTRIBUTOR_AVATARS = [
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80',
  'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
]

export const TEST_CONTRIBUTORS = [
  {
    name: 'Amara Diallo',
    slug: 'amara-diallo',
    role: 'Field Journalist',
    bio: 'Amara is an environmental journalist based in Dakar, Senegal, covering the intersection of climate change and food security across West Africa. Her reporting has taken her to fishing communities in Senegal, dryland farmers in Mali, and mangrove restoration projects in Guinea-Bissau. She holds a degree in environmental science from Cheikh Anta Diop University.',
    specialisation: 'Water & Agriculture',
    socialLinks: [
      { platform: 'Twitter', url: 'https://twitter.com' },
      { platform: 'Instagram', url: 'https://instagram.com' },
    ],
  },
  {
    name: 'Kwame Asante',
    slug: 'kwame-asante',
    role: 'Youth Reporter',
    bio: 'At 24, Kwame has already reported from five African countries on youth-led climate activism. Based in Accra, Ghana, he runs a community radio show that translates complex climate science into stories his neighbourhood can act on. He was a delegate at COP28 and advocates for African youth representation in global climate negotiations.',
    specialisation: 'Youth Voices & Policy',
    socialLinks: [
      { platform: 'Twitter', url: 'https://twitter.com' },
      { platform: 'Instagram', url: 'https://instagram.com' },
    ],
  },
  {
    name: 'Nadia Hassan',
    slug: 'nadia-hassan',
    role: 'Climate Advocate',
    bio: 'Nadia is a climate lawyer and policy advocate from Nairobi, Kenya who works with East African governments to translate IPCC findings into national adaptation strategies. She co-founded a legal aid network for communities displaced by climate-related events and is a regular commentator on African climate policy.',
    specialisation: 'Policy & Law',
    socialLinks: [{ platform: 'Twitter', url: 'https://twitter.com' }],
  },
  {
    name: 'David Osei',
    slug: 'david-osei',
    role: 'Podcast Host',
    bio: 'David is the host of the Youth Climate Dispatch podcast and a science communicator who spent three years working with UNEP on climate education programmes across East Africa. He has a gift for making atmospheric chemistry and ecosystem science accessible to listeners who never studied either.',
    specialisation: 'Science Communication',
    socialLinks: [
      { platform: 'Twitter', url: 'https://twitter.com' },
      { platform: 'Instagram', url: 'https://instagram.com' },
    ],
  },
  {
    name: 'Fatima Al-Rashid',
    slug: 'fatima-al-rashid',
    role: 'Investigative Reporter',
    bio: 'Fatima covers the political economy of oil and gas across North and Central Africa, with a focus on communities living near extraction sites and the environmental costs rarely reported in industry press releases. Based in Cairo, she contributes to regional and international publications and is currently working on a long-form investigation into illegal dumping in the Nile basin.',
    specialisation: 'Energy & Pollution',
    socialLinks: [{ platform: 'Twitter', url: 'https://twitter.com' }],
  },
  {
    name: 'James Mwangi',
    slug: 'james-mwangi',
    role: 'Solutions Editor',
    bio: 'James spent a decade as an agronomist before picking up a pen. His writing focuses exclusively on what works — regenerative farming techniques, community-owned solar projects, and watershed restoration programmes that are changing lives in Eastern and Southern Africa. He believes the story of climate change in Africa is ultimately a story of ingenuity.',
    specialisation: 'Agriculture & Solutions',
    socialLinks: [
      { platform: 'Twitter', url: 'https://twitter.com' },
      { platform: 'Instagram', url: 'https://instagram.com' },
    ],
  },
  {
    name: 'Zoe Ndlovu',
    slug: 'zoe-ndlovu',
    role: 'Photographer & Reporter',
    bio: "Zoe's camera goes where the water goes — or where it no longer does. A documentary photographer and reporter from Harare, Zimbabwe, she has spent the past four years creating visual essays about drought, displacement, and resilience in Southern Africa. Her work has appeared in regional and international publications and won two African journalism awards.",
    specialisation: 'Biodiversity & Water',
    socialLinks: [{ platform: 'Instagram', url: 'https://instagram.com' }],
  },
  {
    name: 'Michael Eze',
    slug: 'michael-eze',
    role: 'Energy Correspondent',
    bio: "Michael covers Africa's energy transition — from the rapid expansion of solar microgrids in rural Nigeria to the politics of continent-wide transmission infrastructure. Based in Lagos, he has interviewed ministers, village solar technicians, and everyone in between, and believes the energy story is the most consequential underreported story on the continent.",
    specialisation: 'Energy',
    socialLinks: [
      { platform: 'Twitter', url: 'https://twitter.com' },
      { platform: 'Instagram', url: 'https://instagram.com' },
    ],
  },
] as const

export const STORY_IMAGES = [
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
  'https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?w=1200&q=80',
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80',
  'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=1200&q=80',
  'https://images.unsplash.com/photo-1466611653911-0507bdcf0ee9?w=1200&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80',
  'https://images.unsplash.com/photo-1504730655501-bbe47e6e6a53?w=1200&q=80',
  'https://images.unsplash.com/photo-1561553873-e8491a564fd0?w=1200&q=80',
]

export const CATEGORY_SLUG: Record<string, string> = {
  'Climate Change': 'climate-change',
  Water: 'water',
  Agriculture: 'agriculture',
  Biodiversity: 'biodiversity',
  Energy: 'energy',
  Pollution: 'pollution',
  'Youth Voices': 'youth-voices',
  Solutions: 'solutions',
  Policy: 'policy',
  Opinion: 'opinion',
}

export const VIDEO_CATEGORY_TAG: Record<string, string> = {
  Energy: 'Educational',
  Biodiversity: 'Documentary',
  'Youth Voices': 'Community Spotlight',
  'Climate Change': 'Documentary',
  Agriculture: 'Field Report',
  Water: 'Documentary',
}

export const TEST_SOLUTIONS = [
  {
    slug: 'farmer-managed-natural-regeneration',
    title: 'Farmer-Managed Natural Regeneration (FMNR)',
    category: 'Agriculture',
    region: 'Sahel',
    status: 'established' as const,
    sectors: ['agriculture'] as const,
    lat: 14.0,
    lng: 0.0,
    partners: ['World Agroforestry Centre'],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    summary:
      'A low-cost technique where farmers systematically manage regrowth of native trees and shrubs on farmland, restoring soil fertility without expensive inputs.',
    impact: '6 million hectares restored across the Sahel since 2000',
    howItWorks:
      'Farmers identify living tree stumps and root systems in degraded fields, then prune and protect regrowth rather than clearing land. Over three to five seasons, canopies return, soil organic matter rises, and crop yields stabilise without chemical fertiliser.',
  },
  {
    slug: 'solar-powered-water-pumps-smallholders',
    title: 'Solar-Powered Water Pumps for Smallholders',
    category: 'Energy',
    region: 'Kenya',
    status: 'scaling' as const,
    sectors: ['energy', 'water'] as const,
    lat: -0.02,
    lng: 37.9,
    partners: ['SolarWorks Coop'],
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80',
    summary:
      'Replacing diesel irrigation pumps with solar-powered alternatives eliminates fuel costs, reduces emissions, and extends the growing season for smallholder farmers.',
    impact: '40% reduction in irrigation costs; 2-season farming enabled',
    howItWorks:
      'Submersible solar pumps draw groundwater during daylight hours, filling storage tanks that release water through drip lines overnight. Cooperatives maintain shared systems, spreading capital costs across dozens of households.',
  },
  {
    slug: 'community-seed-banks',
    title: 'Community Seed Banks',
    category: 'Biodiversity',
    region: 'Ethiopia',
    status: 'established' as const,
    sectors: ['biodiversity', 'agriculture'] as const,
    lat: 9.0,
    lng: 38.7,
    partners: ['Greenline Africa'],
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&q=80',
    summary:
      'Locally managed seed banks preserve drought-resistant indigenous crop varieties that commercial agriculture has discarded — but which communities need as climates shift.',
    impact: 'Over 2,000 indigenous varieties preserved across East Africa',
    howItWorks:
      'Village committees catalogue, dry, and store seeds in ventilated clay or metal containers. Farmers deposit surplus at harvest and withdraw before planting, with strict protocols to prevent cross-contamination.',
  },
  {
    slug: 'biogas-digesters-rural-households',
    title: 'Biogas Digesters for Rural Households',
    category: 'Energy',
    region: 'Rwanda',
    status: 'scaling' as const,
    sectors: ['energy', 'pollution'] as const,
    lat: -1.94,
    lng: 29.87,
    partners: ['Wetlands Trust'],
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80',
    summary:
      'Small-scale biogas systems convert animal and kitchen waste into cooking gas and fertiliser, replacing charcoal and reducing indoor air pollution — a major killer of women and children.',
    impact: 'Used by 500,000+ households in Kenya, Rwanda, and Ethiopia',
    howItWorks:
      'An underground digester breaks down manure and food scraps anaerobically, producing methane piped to a simple stove. The nutrient-rich slurry flows to kitchen gardens, closing the waste loop.',
  },
  {
    slug: 'floating-solar-african-reservoirs',
    title: 'Floating Solar on African Reservoirs',
    category: 'Energy',
    region: 'Ghana',
    status: 'piloted' as const,
    sectors: ['energy', 'water'] as const,
    lat: 7.95,
    lng: -1.02,
    partners: ['Kampala Climate Lab'],
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=1200&q=80',
    summary:
      'Installing solar panels on the surface of reservoirs generates electricity while reducing water evaporation — addressing both the energy and water crises simultaneously.',
    impact: 'Reduces reservoir evaporation by up to 70%; doubles land use efficiency',
    howItWorks:
      'Modular floating platforms anchor to reservoir banks, feeding power into mini-grids or national lines. Shading the water surface slows evaporation during dry seasons when reservoirs are most stressed.',
  },
  {
    slug: 'urban-rooftop-gardens-climate-resilience',
    title: 'Urban Rooftop Gardens for Climate Resilience',
    category: 'Agriculture',
    region: 'Nigeria',
    status: 'piloted' as const,
    sectors: ['agriculture', 'climate-justice'] as const,
    lat: 9.08,
    lng: 8.68,
    partners: ['Youth4Climate UG'],
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    summary:
      'In African cities facing both food insecurity and urban heat islands, rooftop gardens grow food, cool buildings, and build community resilience simultaneously.',
    impact: '15% reduction in building cooling costs; 30kg monthly food per rooftop',
    howItWorks:
      'Lightweight soil mixes and drip irrigation allow vegetables on concrete roofs. Resident cooperatives share maintenance shifts, selling surplus at street markets and composting kitchen waste on-site.',
  },
] as const

export const TEST_VIDEOS = [
  {
    slug: 'how-africa-leading-world-solar-energy',
    title: 'How Africa Is Leading the World on Solar Energy',
    youtubeId: 'KaLsBEHkHAg',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80',
    category: 'Energy',
    durationSeconds: 847,
    description:
      "From Morocco's Noor solar complex to Kenya's geothermal valley, Africa is building the world's most ambitious clean energy infrastructure. This documentary explores the technology, the economics, and the communities being transformed.",
    featured: true,
  },
  {
    slug: 'congo-basin-africa-climate-engine',
    title: "The Congo Basin: Africa's Climate Engine",
    youtubeId: 'Xt8PgCgBvXk',
    thumbnail: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80',
    category: 'Biodiversity',
    durationSeconds: 1203,
    description:
      "The Congo Basin rainforest is the world's second lung — and it is under threat. This film travels deep into the forest to meet the communities protecting it and the scientists measuring what is being lost.",
    featured: true,
  },
  {
    slug: 'youth-climate-action-across-africa',
    title: 'Youth Climate Action Across Africa — The Next Generation Speaks',
    youtubeId: 'G_S_jBRrLMQ',
    thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80',
    category: 'Youth Voices',
    durationSeconds: 612,
    description:
      'Young activists from Kampala to Cape Town, Lagos to Lomé share what they are doing — and what they need from the world — in their own words.',
    featured: false,
  },
  {
    slug: 'drought-displacement-human-face-climate-crisis',
    title: 'Drought and Displacement: The Human Face of the Climate Crisis',
    youtubeId: 'RPBkm5cLIUE',
    thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
    category: 'Climate Change',
    durationSeconds: 1560,
    description:
      'In the Horn of Africa, three consecutive failed rainy seasons have forced millions from their homes. This documentary follows three families across 12 months as they navigate displacement, hope, and resilience.',
    featured: false,
  },
  {
    slug: 'regenerative-farming-african-farmers-healing-land',
    title: 'Regenerative Farming: How African Farmers Are Healing the Land',
    youtubeId: 'fFJFNFP_CWo',
    thumbnail: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=1200&q=80',
    category: 'Agriculture',
    durationSeconds: 924,
    description:
      'Across sub-Saharan Africa, a quiet revolution in regenerative agriculture is restoring soil health, increasing yields, and sequestering carbon — without synthetic inputs.',
    featured: false,
  },
  {
    slug: 'future-of-water-east-africa',
    title: 'The Future of Water in East Africa',
    youtubeId: 'W2TE0kfCOtI',
    thumbnail: 'https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?w=1200&q=80',
    category: 'Water',
    durationSeconds: 1087,
    description:
      'Lake Victoria, the Nile, and the glaciers of the East African Rift are all under pressure from rising temperatures and growing populations. Scientists and communities share what the next 30 years will look like.',
    featured: true,
  },
] as const

export const TEST_PODCAST_SERIES = [
  {
    name: 'Youth Climate Dispatch',
    slug: 'youth-climate-dispatch',
    description:
      'Weekly conversations on climate science, policy, and frontline reporting across Africa — hosted by David Osei.',
    type: 'podcast' as const,
    cover: 'https://images.unsplash.com/photo-1478737270239-2f02ca77fc66?w=800&q=80',
  },
  {
    name: 'Field Journalists',
    slug: 'field-journalists',
    description:
      'On-the-ground dispatches from EcoDiaries reporters documenting climate impacts in villages, markets, and watersheds.',
    type: 'podcast' as const,
    cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
  },
  {
    name: 'Climate Advocates',
    slug: 'climate-advocates',
    description:
      'Policy, protest, and power — conversations with lawyers, organisers, and negotiators shaping Africa\'s climate future.',
    type: 'podcast' as const,
    cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  },
  {
    name: 'Solutions on the Ground',
    slug: 'solutions-on-the-ground',
    description:
      'What is working in African communities — solar cooperatives, seed banks, wetland restoration, and more.',
    type: 'podcast' as const,
    cover: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80',
  },
] as const

/** @deprecated use TEST_PODCAST_SERIES[0] */
export const PODCAST_SERIES = TEST_PODCAST_SERIES[0]

export const TEST_PODCAST_EPISODES = [
  {
    slug: 'why-lake-chad-matters-to-the-entire-world',
    seriesSlug: 'youth-climate-dispatch',
    title: 'Why Lake Chad Matters to the Entire World',
    episodeNumber: 1,
    seasonNumber: 1,
    durationSeconds: 2340,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    hosts: ['david-osei', 'amara-diallo'] as const,
    description:
      "David and Amara dig into the science and politics of Lake Chad's collapse — one of the most dramatic environmental changes in recorded history — and what its story tells us about the next 50 years of freshwater in Africa.",
    featured: true,
  },
  {
    slug: 'solar-revolution-who-really-benefits',
    seriesSlug: 'youth-climate-dispatch',
    title: 'Solar Revolution: Who Really Benefits?',
    episodeNumber: 2,
    seasonNumber: 1,
    durationSeconds: 2760,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    hosts: ['david-osei', 'michael-eze'] as const,
    description:
      'Nigeria is home to 90 million people without electricity. Solar is supposed to fix that. Michael Eze joins David to ask the harder question: who designs the systems, who controls the financing, and who actually profits?',
    featured: false,
  },
  {
    slug: 'cop-fatigue-africa-youth-done-waiting',
    seriesSlug: 'youth-climate-dispatch',
    title: "COP Fatigue: Are Africa's Youth Done Waiting?",
    episodeNumber: 3,
    seasonNumber: 1,
    durationSeconds: 3120,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    hosts: ['david-osei', 'kwame-asante'] as const,
    description:
      'Kwame Asante was at COP28 in Dubai. He sat through the negotiations, talked to ministers, and came home more frustrated than inspired. He and David talk about what the youth climate movement in Africa needs to change.',
    featured: false,
  },
  {
    slug: 'forest-that-holds-world-together',
    seriesSlug: 'youth-climate-dispatch',
    title: 'The Forest That Holds the World Together',
    episodeNumber: 4,
    seasonNumber: 1,
    durationSeconds: 2580,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
    hosts: ['david-osei', 'zoe-ndlovu'] as const,
    description:
      "Zoe has spent months in and around the Congo Basin making her documentary series. She joins David to describe what she saw, heard, and smelled in the world's second largest tropical forest — and why it terrifies her.",
    featured: false,
  },
  {
    slug: 'can-regenerative-agriculture-feed-warming-continent',
    seriesSlug: 'youth-climate-dispatch',
    title: 'Can Regenerative Agriculture Feed a Warming Continent?',
    episodeNumber: 5,
    seasonNumber: 1,
    durationSeconds: 2940,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    hosts: ['david-osei', 'james-mwangi'] as const,
    description:
      'James Mwangi spent 10 years as an agronomist before he became a journalist. He and David get into the science of soil — why healthy soil is Africa\'s best climate adaptation strategy, and what is stopping farmers from restoring it.',
    featured: false,
  },
  {
    slug: 'climate-policy-africa-who-has-power',
    seriesSlug: 'youth-climate-dispatch',
    title: 'Climate Policy in Africa: Who Has the Power?',
    episodeNumber: 6,
    seasonNumber: 1,
    durationSeconds: 3360,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1561553873-e8491a564fd0?w=800&q=80',
    hosts: ['david-osei', 'nadia-hassan'] as const,
    description:
      'Nadia Hassan has read every African national climate adaptation plan. Most of them, she says, are written for donor approval rather than community need. She and David dismantle the policy architecture and propose what a different approach might look like.',
    featured: false,
  },
] as const

export const TEST_PROGRAMMES = [
  {
    name: 'Young Climate Reporters Fellowship',
    slug: 'young-climate-reporters-fellowship',
    summary:
      'A 6-month fellowship for African journalists aged 18–30 to develop climate reporting skills, build a published portfolio, and join a continent-wide network of environmental journalists.',
    applicationDeadline: '2025-09-30',
    applicationOpenDate: '2025-06-01',
    startDate: '2025-11-01',
    category: 'Youth Voices',
    eligibility: 'African citizens aged 18–30 with at least one published piece',
    locationType: 'hybrid',
    accentColor: 'bg-magenta',
    status: 'open' as const,
  },
  {
    name: 'Community Climate Storytelling Workshops',
    slug: 'community-climate-storytelling-workshops',
    summary:
      'Free two-day workshops teaching community members to document and share their climate experiences using mobile phones, basic video, and social media.',
    applicationDeadline: '2025-08-15',
    startDate: '2025-09-01',
    category: 'Climate Change',
    eligibility: 'Open to all community members across participating countries',
    locationType: 'in-person',
    accentColor: 'bg-forest',
    status: 'open' as const,
  },
  {
    name: 'Solutions Journalism Mentorship',
    slug: 'solutions-journalism-mentorship',
    summary:
      'One-on-one mentorship pairing early-career African journalists with experienced solutions reporters to develop skills in covering climate innovations without falling into greenwashing traps.',
    applicationDeadline: '2025-10-01',
    startDate: '2025-11-15',
    category: 'Solutions',
    eligibility: 'Journalists with 1–5 years of experience',
    locationType: 'remote',
    accentColor: 'bg-teal',
    status: 'open' as const,
  },
  {
    name: 'EcoDiaries Podcast Residency',
    slug: 'ecodiaries-podcast-residency',
    summary:
      'A 3-month residency for audio storytellers to develop, produce, and launch a podcast series on an African climate topic of their choice, with full production support.',
    applicationDeadline: '2025-07-31',
    startDate: '2025-09-15',
    category: 'Youth Voices',
    eligibility: 'Open to audio journalists and podcasters across Africa',
    locationType: 'remote',
    accentColor: 'bg-lime2',
    status: 'open' as const,
  },
  {
    name: 'Climate Data Journalism Bootcamp',
    slug: 'climate-data-journalism-bootcamp',
    summary:
      'A 5-day intensive teaching journalists how to access, analyse, and visualise climate data — from satellite imagery to national emissions inventories — to strengthen their reporting.',
    applicationDeadline: '2025-08-01',
    startDate: '2025-09-10',
    category: 'Policy',
    eligibility: 'Journalists of all experience levels; basic spreadsheet skills helpful',
    locationType: 'in-person',
    accentColor: 'bg-gold',
    status: 'open' as const,
  },
  {
    name: 'Pan-African Climate Media Network',
    slug: 'pan-african-climate-media-network',
    summary:
      'A year-round membership network connecting climate journalists across 30 African countries — sharing stories, sources, translations, and editorial resources across borders and languages.',
    applicationDeadline: '2025-12-31',
    startDate: '2026-01-01',
    category: 'Solutions',
    eligibility: 'Professional journalists and editors covering climate in Africa',
    locationType: 'remote',
    accentColor: 'bg-maroon',
    status: 'open' as const,
  },
] as const

export const TEST_PARTNERS = [
  {
    name: 'African Climate Foundation',
    link: 'https://africanclimatefoundation.org',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=80',
    description:
      'Pan-African foundation funding climate solutions and policy research across the continent.',
  },
  {
    name: 'UNEP Africa Office',
    link: 'https://www.unep.org/regions/africa',
    logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80',
    description:
      'United Nations Environment Programme regional office coordinating environmental action across Africa.',
  },
  {
    name: 'Green Climate Fund',
    link: 'https://www.greenclimate.fund',
    logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
    description:
      'Global fund supporting developing nations in limiting greenhouse gas emissions and adapting to climate change.',
  },
  {
    name: 'African Journalists for the Environment',
    link: 'https://ajenvironment.org',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',
    description:
      'Network of environmental journalists across 25 African countries strengthening climate reporting.',
  },
  {
    name: 'Pan African Climate Justice Alliance',
    link: 'https://www.pacja.org',
    logo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
    description:
      'Civil society coalition advocating for climate justice and equitable climate finance for Africa.',
  },
  {
    name: 'Wangari Maathai Foundation',
    link: 'https://wangarimarathai.org',
    logo: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
    description:
      'Carrying forward the legacy of Nobel laureate Wangari Maathai through environmental and democratic education.',
  },
] as const

export const TEST_CONTACT_SUBMISSIONS = [
  {
    name: 'Ibrahim Koné',
    email: 'ibrahim.kone@example.com',
    reason: 'contributor' as const,
    message:
      "I am a journalist based in Abidjan covering environmental issues in Côte d'Ivoire. I have been following EcoDiaries for two years and would love to contribute stories on coastal erosion along the Gulf of Guinea. Could you tell me more about your contributor application process?",
    status: 'new' as const,
  },
  {
    name: 'Grace Njoroge',
    email: 'grace.njoroge@example.com',
    reason: 'partnership' as const,
    message:
      'I represent Green Schools Kenya, a network of 200 schools running environmental clubs and sustainability projects. We would love to explore a partnership with EcoDiaries to amplify our students\' climate stories and connect them with your Young Climate Reporters Fellowship. Please let me know who I can speak with.',
    status: 'new' as const,
  },
  {
    name: 'Tendai Mukweza',
    email: 'tendai.mukweza@example.com',
    reason: 'other' as const,
    message:
      "I read your recent article on water scarcity in Zimbabwe with great interest. However, the figure cited for Harare's water coverage appears to be outdated — the 2024 audit showed coverage has improved to 68%, not the 45% mentioned. I can provide the source document if helpful.",
    status: 'read' as const,
  },
  {
    name: 'Aïssatou Barry',
    email: 'aissatou.barry@example.com',
    reason: 'story-tip' as const,
    message:
      "I have spent the past six months documenting a women's cooperative in the Fouta Djallon region who have replanted over 40,000 trees using traditional land management knowledge. I have photography, video, and interviews. This is a story EcoDiaries must tell. How do I submit it?",
    status: 'new' as const,
  },
  {
    name: 'Emeka Okonkwo',
    email: 'emeka.okonkwo@example.com',
    reason: 'programmes' as const,
    message:
      'I have been producing a podcast about oil communities in the Niger Delta for the past year on a self-funded basis. I am extremely interested in the Podcast Residency programme — specifically whether applicants from Nigeria are eligible given the political sensitivity of some of my topics. Could someone clarify?',
    status: 'new' as const,
  },
] as const

export const TEST_NEWSLETTER_SUBSCRIBERS = [
  { email: 'test.subscriber.1@example.com', status: 'confirmed' as const },
  { email: 'test.subscriber.2@example.com', status: 'confirmed' as const },
  { email: 'test.subscriber.3@example.com', status: 'pending' as const },
  { email: 'test.subscriber.4@example.com', status: 'confirmed' as const },
  { email: 'test.subscriber.5@example.com', status: 'confirmed' as const },
]

export const EXTRA_CONTRIBUTOR_AVATARS = [
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
]

export const EXTRA_CONTRIBUTORS = [
  {
    name: 'Amina Okafor',
    slug: 'amina-okafor',
    role: 'Poet',
    region: 'Lagos, Nigeria',
    bio: 'Amina writes poetry about oil spills, flooded markets, and the resilience of coastal communities in the Niger Delta. Her work has been performed at literary festivals across West Africa.',
    specialisation: 'Poetry & Climate Justice',
    socialLinks: [{ platform: 'Instagram', url: 'https://instagram.com' }],
    skipPhoto: true,
  },
  {
    name: 'Tomas Bekker',
    slug: 'tomas-bekker',
    role: 'Filmmaker',
    region: 'Cape Town, South Africa',
    bio: 'Tomas produces short documentaries on renewable energy transitions and community land rights. His films have screened at Encounters and Durban Film Festival.',
    specialisation: 'Film & Energy',
    socialLinks: [
      { platform: 'Twitter', url: 'https://twitter.com' },
      { platform: 'Website', url: 'https://example.com' },
    ],
    skipPhoto: false,
  },
  {
    name: 'Sofia Menelik',
    slug: 'sofia-menelik',
    role: 'Photographer',
    region: 'Addis Ababa, Ethiopia',
    bio: 'Sofia documents highland farming communities adapting to erratic rainfall through terracing and indigenous seed varieties.',
    specialisation: 'Photography & Agriculture',
    socialLinks: [{ platform: 'Instagram', url: 'https://instagram.com' }],
    skipPhoto: false,
  },
  {
    name: 'Dr. Raj Patel',
    slug: 'raj-patel',
    role: 'Researcher',
    region: 'Nairobi, Kenya',
    bio: 'Raj is an agricultural ecologist publishing on soil carbon and smallholder adaptation across East Africa.',
    specialisation: 'Research & Agriculture',
    socialLinks: [],
    skipPhoto: true,
  },
  {
    name: 'Chidi Nwosu',
    slug: 'chidi-nwosu',
    role: 'Writer & Filmmaker',
    region: 'Enugu, Nigeria',
    bio: 'Chidi combines reported essays with short film to tell stories about deforestation and community forestry in southeastern Nigeria.',
    specialisation: 'Writing & Film',
    socialLinks: [{ platform: 'Twitter', url: 'https://twitter.com' }],
    skipPhoto: false,
  },
  {
    name: 'Leah Morrison',
    slug: 'leah-morrison',
    role: 'Audio Producer',
    region: 'Accra, Ghana',
    bio: 'Leah produces narrative audio stories about urban flooding and informal settlement adaptation in West African cities.',
    specialisation: 'Audio & Urban Climate',
    socialLinks: [],
    skipPhoto: false,
  },
  {
    name: 'Youssef Benali',
    slug: 'youssef-benali',
    role: 'Photographer',
    region: 'Marrakech, Morocco',
    bio: 'Youssef photographs solar installations and water infrastructure projects across North Africa for regional outlets.',
    specialisation: 'Photography & Water',
    socialLinks: [{ platform: 'Instagram', url: 'https://instagram.com' }],
    skipPhoto: false,
  },
] as const

export const EXTRA_PODCAST_EPISODES = [
  {
    slug: 'seed-qa-dispatches-from-the-sahel',
    seriesSlug: 'field-journalists',
    title: 'Dispatches from the Sahel: When the Rains Shift',
    episodeNumber: 1,
    seasonNumber: 1,
    durationSeconds: 1980,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    hosts: ['amara-diallo'] as const,
    description: 'Amara reports from pastoral communities navigating a fourth failed rainy season and impossible choices about livestock and migration.',
    featured: false,
  },
  {
    slug: 'seed-qa-market-day-after-the-flood',
    seriesSlug: 'field-journalists',
    title: 'Market Day After the Flood',
    episodeNumber: 2,
    seasonNumber: 1,
    durationSeconds: 2220,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    hosts: ['zoe-ndlovu', 'kwame-asante'] as const,
    description: 'Zoe and Kwame visit a riverside market rebuilding after flash floods destroyed stalls and contaminated wells.',
    featured: false,
  },
  {
    slug: 'seed-qa-climate-courts-and-community-power',
    seriesSlug: 'climate-advocates',
    title: 'Climate Courts and Community Power',
    episodeNumber: 1,
    seasonNumber: 1,
    durationSeconds: 2640,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    hosts: ['nadia-hassan'] as const,
    description: 'Nadia explains how communities are using litigation and collective organising to hold governments accountable for adaptation funding.',
    featured: false,
  },
  {
    slug: 'seed-qa-youth-blockades-what-comes-next',
    seriesSlug: 'climate-advocates',
    title: 'Youth Blockades: What Comes Next?',
    episodeNumber: 2,
    seasonNumber: 1,
    durationSeconds: 2410,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    hosts: ['kwame-asante', 'fatima-al-rashid'] as const,
    description: 'Kwame and Fatima debate whether street protest still moves policy — or whether organisers need new tactics.',
    featured: false,
  },
  {
    slug: 'seed-qa-seed-banks-that-saved-a-village',
    seriesSlug: 'solutions-on-the-ground',
    title: 'The Seed Banks That Saved a Village',
    episodeNumber: 1,
    seasonNumber: 1,
    durationSeconds: 2100,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    hosts: ['james-mwangi', 'david-osei'] as const,
    description: 'James visits an Ethiopian community seed bank preserving drought-resistant varieties as insurance against crop failure.',
    featured: true,
  },
  {
    slug: 'seed-qa-solar-pumps-at-dawn',
    seriesSlug: 'solutions-on-the-ground',
    title: 'Solar Pumps at Dawn',
    episodeNumber: 2,
    seasonNumber: 1,
    durationSeconds: 1890,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80',
    hosts: ['michael-eze'] as const,
    description: 'Michael follows a Kenyan cooperative installing shared solar irrigation — and asks who owns the water when the sun sets.',
    featured: false,
  },
] as const

export const TEST_COMMUNITY_PROJECTS = [
  {
    title: 'Lake Turkana Fishing Cooperatives',
    description:
      'Community-led monitoring of lake levels and fish stocks, paired with advocacy for equitable water releases from upstream dams.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
    relatedStorySlug: 'lake-that-fed-a-nation-disappearing',
  },
  {
    title: 'Kampala Urban Garden Network',
    description:
      'Neighbourhood groups transforming flood-prone vacant lots into shared food gardens with compost training and rainwater capture.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    relatedStorySlug: 'youth-climate-strikers-nairobi',
  },
  {
    title: 'Sahel FMNR Champions',
    description:
      'Farmer-managed natural regeneration trainers working across Mali and Niger to restore tree cover on degraded cropland.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    relatedStorySlug: 'ugandan-farmer-food-forest',
  },
  {
    title: 'Cape Flats Solar Schools',
    description:
      'Parents and teachers installing rooftop solar at public schools to keep classrooms lit during load-shedding.',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80',
    relatedStorySlug: 'solar-microgrids-rural-nigeria',
  },
  {
    title: 'Wetland Guardians of Eastern Uganda',
    description:
      'Volunteer committees restoring papyrus wetlands that filter water for downstream villages and buffer flood peaks.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80',
    relatedStorySlug: 'mangroves-coming-back-senegal-coast',
  },
] as const

export const LAUNCH_VIDEO_FIXTURES = [
  {
    slug: 'wetlands-restoration-documentary',
    youtubeId: 'eGCqWRIKO9k',
    thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80',
    durationSeconds: 720,
  },
  {
    slug: 'solar-cooperative-field-report',
    youtubeId: '1kUE0BZtRRc',
    thumbnail: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&q=80',
    durationSeconds: 480,
  },
] as const

export const TEST_VIDEO_SERIES = {
  name: 'EcoDiaries Field Reports',
  slug: 'ecodiaries-field-reports',
  description: 'Short documentaries and field reports from EcoDiaries contributors across Africa.',
  type: 'video' as const,
  cover: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80',
} as const
