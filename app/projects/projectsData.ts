export type Project = {
  id: number
  slug: string
  label: string
  title: string
  shortDescription: string
  description: string
  technologies: string[]
  github?: string
  demo?: string
  documents?: {
    title: string
    href: string
  }[]
  image: string
  year: string
  role: string
  status: 'In Progress' | 'Completed'
  highlights: string[]
}

export const projects: Project[] = [
  {
    id: 105,
    slug: 'viral-things',
    label: 'Restock Tracker',
    title: 'ViralThings',
    shortDescription:
      'A Telegram-powered stock watcher for tracking brand product restocks by size.',
    description:
      'ViralThings is a restock tracking app for following products from Zara, Bershka, Pull & Bear, and Stradivarius. Users paste a product URL, select a size, connect their Telegram ID, and get notified when the product becomes available again.\n\nThe project focuses on a sharp, utility-first flow: quick tracking, active subscription management, and no-fluff stock alerts for fast-moving items.',
    technologies: ['Next.js', 'Telegram Bot', 'PWA'],
    github: '',
    demo: 'https://viral-things.vercel.app/',
    image: '/projects/viral-things.jpeg',
    year: '2026',
    role: 'Full Stack Developer',
    status: 'Completed',
    documents: [],
    highlights: [
      'Product URL tracking for Zara, Bershka, Pull & Bear, and Stradivarius',
      'Size-specific restock monitoring with active subscription management',
      'Telegram notification flow for fast stock alerts',
    ],
  },
  {
    id: 101,
    slug: 'dead-blockchain-theory',
    label: 'Blockchain Analytics',
    title: 'Dead Blockchain Theory',
    shortDescription:
      'A blockchain analytics dashboard that tracks estimated bot activity across networks.',
    description:
      'Dead Blockchain Theory is a live analytics project for exploring estimated bot activity across blockchains. It turns chain activity signals into a dashboard that is easy to scan and compare, with Dune-ready analytics behind the story.\n\nThe project frames blockchain usage through a sharper question: how much of the activity is organic, and how much may be automated?',
    technologies: ['Next.js', 'Dune Analytics', 'Web3'],
    github: '',
    demo: 'https://dead-blockchain.vercel.app/',
    image: '/projects/deadblockchaintheory.png',
    year: '2026',
    role: 'Blockchain Developer',
    status: 'Completed',
    documents: [],
    highlights: [
      'Live dashboard for estimated bot activity across blockchains',
      'Dune-ready analytics narrative for on-chain behavior',
      'High-contrast interface focused on quick comparison',
    ],
  },
  {
    id: 102,
    slug: 'ab-c',
    label: 'Blockchain Project',
    title: 'AB/C',
    shortDescription:
      'A compact Web3 experiment connected to blockchain activity comparison and analysis.',
    description:
      'AB/C is a Web3 project hosted with the Dead Blockchain Theory demo, focused on making blockchain activity patterns easier to compare. It keeps the experience lightweight while pointing users toward a clearer read of network behavior.\n\nThe work centers on presenting abstract on-chain signals in a more direct and memorable way.',
    technologies: ['Next.js', 'Web3', 'Analytics'],
    github: '',
    demo: 'https://dead-blockchain.vercel.app/',
    image: '/projects/AB-C_X_profile_HD.png',
    year: '2026',
    role: 'Blockchain Developer',
    status: 'Completed',
    documents: [],
    highlights: [
      'Concise project identity for blockchain comparison',
      'Live demo connected to the Dead Blockchain Theory experience',
      'Simple analytics-first presentation for on-chain signals',
    ],
  },
  {
    id: 103,
    slug: 'miv-blockspace',
    label: 'Blockchain Dashboard',
    title: 'Miv Blockspace',
    shortDescription:
      'A real-time Monad blockspace intelligence dashboard for following network activity.',
    description:
      'Miv Blockspace is a real-time Monad blockspace monitor designed to make network activity easier to follow. The project focuses on blockspace intelligence, turning live blockchain signals into a dashboard that can be read quickly.\n\nThe interface is built around clarity, current activity, and a product feel suited for Web3 monitoring.',
    technologies: ['React', 'Monad', 'Data Visualization'],
    github: '',
    demo: 'https://miv-blockspace.vercel.app/',
    image: '/projects/miv-blockspace.png',
    year: '2026',
    role: 'Frontend Developer',
    status: 'Completed',
    documents: [],
    highlights: [
      'Real-time Monad blockspace monitoring experience',
      'Dashboard layout for fast network activity scanning',
      'Focused visual system for blockspace intelligence',
    ],
  },
  {
    id: 104,
    slug: 'praxis-lab',
    label: 'Creative Technology',
    title: 'Praxis Lab',
    shortDescription:
      'A creative technology studio website for the two-person studio by Hale and Burak.',
    description:
      'Praxis Lab is a studio website for a two-person creative technology practice by Hale and Burak. It presents the studio with a refined editorial feel while keeping the experience direct, polished, and easy to navigate.\n\nThe project brings together creative direction, web experience design, and a clear identity for collaborative technology work.',
    technologies: ['React', 'Creative Technology', 'Web Design'],
    github: '',
    demo: 'https://praxis-lab-blond.vercel.app/',
    image: '/projects/praxislab.png',
    year: '2026',
    role: 'Frontend Developer',
    status: 'Completed',
    documents: [],
    highlights: [
      'Studio identity for a two-person creative technology practice',
      'Editorial web presence with a refined visual direction',
      'Responsive presentation for creative and technical work',
    ],
  },
  {
    id: 1,
    slug: 'health-analysis-ai',
    label: 'MCP Project',
    title: 'Health Analysis AI',
    shortDescription:
      'An AI-assisted health insight app that turns uploaded lab reports into readable summaries and next-step recommendations.',
    description:
      'Health Analysis AI helps users understand lab report data without needing to decode medical terminology by hand. The app extracts key values from uploaded reports, highlights abnormal signals, and presents concise guidance in a clean, approachable flow.\n\nI focused on the document parsing flow, the summary experience, and keeping the interface calm and trustworthy for daily use. The visual direction is intentionally healthcare-oriented to reinforce clarity and confidence.',
    technologies: ['Flutter', 'Python'],
    github: '',
    demo: '',
    image: '/projects/tahlil.svg',
    year: '2025',
    role: 'Mobile Developer',
    status: 'In Progress',
    documents: [
      {
        title: 'Project PDF',
        href:
          '/projects/s%C3%BCre%C3%A7%202025%20G%C3%BCz%20100%25%20C6%20Yapay%20Zeka%20Destekli%20Tahlil%20Analiz%20Sistemi%20Yapay%20Zeka%20Destekli%20Tahlil%20Analiz%20Sistemi%20Ekran%20okuyucu%20deste%C4%9Fini%20etkinle%C5%9Ftirin%20Ekran%20okuyucu%20deste%C4%9Fini%20etkinle%C5%9Ftirmek%20i%C3%A7in%20Ctrl%2BAl%20(1).pdf',
      },
    ],
    highlights: [
      'Branded health-focused hero system inspired by the project logo',
      'PDF upload and extraction flow for lab report analysis',
      'Plain-language summary cards for non-technical users',
    ],
  },
  {
    id: 2,
    slug: 'freelandser-freelance-platform',
    label: 'API Project',
    title: 'FreeLandser',
    shortDescription:
      'A trustless freelance marketplace for profiles, job listings, and secure payment flows.',
    description:
      'FreeLandser is a marketplace concept built around transparent client-freelancer collaboration. The product combines profile pages, job listings, and a payment flow designed to reduce friction while keeping transactions clear and trustworthy.\n\nThe visual direction follows the brand cover you shared: a soft gradient background, centered hero branding, and a strong icon-led identity. My work focused on the landing page structure, reusable UI sections, and making the experience feel polished enough for a modern freelance platform.',
    technologies: ['React', 'TypeScript', 'Solidity', 'Tailwind CSS'],
    github: '',
    demo: '',
    image: '/projects/freelanser.svg',
    year: '2025',
    role: 'Full Stack Developer',
    status: 'Completed',
    documents: [
      {
        title: 'Project PDF',
        href: '/projects/FreeLandser.pdf',
      },
    ],
    highlights: [
      'Hero branding and landing page system based on the cover design',
      'Role-based freelancer profiles and project listing flows',
      'Secure payment architecture with a web3-ready structure',
    ],
  },
  {
    id: 3,
    slug: 'wallet-guardai',
    label: 'Blockchain Project',
    title: 'Wallet GuardAI',
    shortDescription:
      'An AI-powered Web3 security copilot for wallet and transaction risk analysis.',
    description:
      'Wallet GuardAI is an AI-powered Web3 security copilot that provides real-time risk analysis for wallets and transactions. By fetching and simplifying complex on-chain data, the AI generates instant risk scores, plain-English explanations, and actionable recommendations. It goes beyond displaying raw data by directly answering questions like "Is this wallet safe?" and "Should I proceed?", helping users make secure and informed Web3 decisions.',
    technologies: ['Solidity', 'Python'],
    github: 'https://github.com/BurakSahin00/blitz-hackathon.git',
    demo: '',
    image: '/projects/walletguardai.png',
    year: '2025',
    role: 'Blockchain Developer',
    status: 'Completed',
    documents: [],
    highlights: [
      'Real-time wallet and transaction risk scoring',
      'Plain-language AI explanations for on-chain activity',
      'Actionable security recommendations before approving actions',
    ],
  },
]

export const requiredProjectSlugs = [
  'viral-things',
  'dead-blockchain-theory',
  'ab-c',
  'miv-blockspace',
  'praxis-lab',
  'wallet-guardai',
]

export const getProjectBySlug = (slug: string) => {
  return projects.find((project) => project.slug === slug)
}
