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
]

export const getProjectBySlug = (slug: string) => {
  return projects.find((project) => project.slug === slug)
}
