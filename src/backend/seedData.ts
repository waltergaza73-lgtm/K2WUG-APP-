export const initialUsers = [
  {
    id: 'usr_demo_101',
    name: 'Kiprono Cheruiyot',
    email: 'demo@k2wug.org',
    passwordHash: '$2a$10$wT8K8N1/bMvL4u.2qM1.euA3XN2I4y.xGq8.x8Gq.x8Gq.x8Gq.x8', // "password123"
    role: 'provider' as const,
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    bio: 'Senior Full Stack Developer & Tech Consultant serving businesses across East Africa.',
    skills: ['TypeScript', 'React', 'Node.js', 'MongoDB', 'Cloud Solutions'],
    walletBalance: 1450.00,
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_provider_102',
    name: 'Amina Namubiru',
    email: 'amina@k2wug.org',
    passwordHash: '$2a$10$wT8K8N1/bMvL4u.2qM1.euA3XN2I4y.xGq8.x8Gq.x8Gq.x8Gq.x8',
    role: 'provider' as const,
    phone: '+256 772 987 654',
    location: 'Kampala, Uganda',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    bio: 'Professional UI/UX Designer and Brand Identity Strategist.',
    skills: ['UI/UX', 'Figma', 'Branding', 'Mobile Design'],
    walletBalance: 820.50,
    createdAt: new Date().toISOString()
  }
];

export const initialServices = [
  {
    id: 'srv_1',
    title: 'Custom Web & Mobile App Development',
    category: 'Technology & IT',
    description: 'End-to-end full-stack software development tailored for businesses, e-commerce, and startups with responsive design and cloud integration.',
    price: 45,
    priceUnit: 'hr' as const,
    providerId: 'usr_demo_101',
    providerName: 'Kiprono Cheruiyot',
    providerRating: 4.9,
    providerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    location: 'Nairobi / Remote',
    tags: ['Web Dev', 'Mobile', 'Node.js', 'React'],
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    available: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'srv_2',
    title: 'Brand Design & Digital Identity Package',
    category: 'Design & Creative',
    description: 'Complete brand guide, logo vector assets, typography scale, social media templates, and marketing collateral.',
    price: 350,
    priceUnit: 'fixed' as const,
    providerId: 'usr_provider_102',
    providerName: 'Amina Namubiru',
    providerRating: 5.0,
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    location: 'Kampala / Remote',
    tags: ['Logo', 'Figma', 'Branding', 'Graphics'],
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
    available: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'srv_3',
    title: 'Solar Energy & Inverter Systems Installation',
    category: 'Engineering & Construction',
    description: 'Professional solar installation for residential and commercial premises with warranty and power auditing.',
    price: 120,
    priceUnit: 'day' as const,
    providerId: 'usr_eng_103',
    providerName: 'K2W Solar Experts',
    providerRating: 4.8,
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    location: 'Kisumu / Busia / Malaba',
    tags: ['Solar', 'Electrical', 'Renewable Energy'],
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800',
    available: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'srv_4',
    title: 'Digital Marketing & SEO Growth Campaign',
    category: 'Marketing & Sales',
    description: 'Data-driven Google Ads, social media marketing, and technical SEO optimization to convert local leads into customers.',
    price: 30,
    priceUnit: 'hr' as const,
    providerId: 'usr_mkt_104',
    providerName: 'Grace Otieno',
    providerRating: 4.7,
    providerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300',
    location: 'Eldoret, Kenya',
    tags: ['SEO', 'Google Ads', 'Social Media', 'Leads'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    available: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const initialJobs = [
  {
    id: 'job_1',
    title: 'Senior Frontend Developer (React / TypeScript)',
    company: 'K2W Financial Technologies',
    category: 'Software Engineering',
    type: 'Full-time' as const,
    location: 'Nairobi / Hybrid',
    salaryRange: '$1,800 - $2,500 / month',
    description: 'We are seeking a seasoned frontend engineer to lead the development of our next-gen cross-border remittance dashboard and wallet features.',
    requirements: ['3+ years experience with React & TypeScript', 'Experience building secure fintech UIs', 'Familiarity with REST APIs & WebSockets'],
    employerId: 'usr_emp_201',
    applicationsCount: 14,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'job_2',
    title: 'Regional Supply Chain & Operations Coordinator',
    company: 'East Africa Logistics Hub',
    category: 'Logistics & Operations',
    type: 'Contract' as const,
    location: 'Tororo / Busia Border',
    salaryRange: '$1,200 - $1,600 / month',
    description: 'Oversee cross-border freight operations, customs documentation, and driver dispatching between Kenya and Uganda.',
    requirements: ['Degree in Supply Chain or Logistics', 'Bilingual English & Swahili', '2+ years logistics experience'],
    employerId: 'usr_emp_202',
    applicationsCount: 9,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'job_3',
    title: 'Fintech Backend Architect (Node.js & MongoDB)',
    company: 'K2WUG Pay',
    category: 'Software Engineering',
    type: 'Remote' as const,
    salaryRange: '$2,200 - $3,200 / month',
    description: 'Design scalable microservices, manage MongoDB clusters, and build real-time transaction processing pipelines.',
    requirements: ['Expertise in Node.js, Express, and MongoDB', 'Experience with JWT auth & security practices', 'Cloud Run or Docker deployment knowledge'],
    employerId: 'usr_demo_101',
    applicationsCount: 22,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const initialMarketplace = [
  {
    id: 'mkt_1',
    title: 'MacBook Pro M2 14" (16GB RAM, 512GB SSD)',
    category: 'Electronics & Computers',
    price: 1250,
    condition: 'Like New' as const,
    description: 'In pristine condition with original charger and box. Battery health 96%. Ideal for software engineering and video editing.',
    sellerId: 'usr_demo_101',
    sellerName: 'Kiprono Cheruiyot',
    sellerLocation: 'Nairobi, Kenya',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    status: 'available' as const,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 'mkt_2',
    title: 'Dell UltraSharp 27" 4K USB-C Monitor',
    category: 'Electronics & Computers',
    price: 320,
    condition: 'Good' as const,
    description: 'High color accuracy display with built-in USB hub. Great for multi-monitor developer setups.',
    sellerId: 'usr_provider_102',
    sellerName: 'Amina Namubiru',
    sellerLocation: 'Kampala, Uganda',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    status: 'available' as const,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'mkt_3',
    title: 'Ergonomic Mesh Office Chair with Lumbar Support',
    category: 'Furniture & Office',
    price: 180,
    condition: 'New' as const,
    description: 'Unopened in box. High density foam cushion, adjustable 3D armrests and tilt lock.',
    sellerId: 'usr_furn_105',
    sellerName: 'E.A. Ergonomics',
    sellerLocation: 'Eldoret, Kenya',
    imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&q=80&w=800',
    status: 'available' as const,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const initialTransactions = [
  {
    id: 'tx_101',
    userId: 'usr_demo_101',
    type: 'deposit' as const,
    amount: 1000.00,
    title: 'Mobile Money Top-up (M-Pesa / MTN)',
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: 'tx_102',
    userId: 'usr_demo_101',
    type: 'earned' as const,
    amount: 500.00,
    title: 'Service Fee Received - Web Development Project',
    recipientOrSender: 'Amina Namubiru',
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'tx_103',
    userId: 'usr_demo_101',
    type: 'payment' as const,
    amount: -50.00,
    title: 'K2WUG Service Promotion Listing Fee',
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const initialBuyingMachines = [
  {
    id: 'sk_starter_20',
    name: 'SK Starter Machine 1.0',
    tag: 'FEATURED 7-DAY PLAN',
    price: 20,
    durationDays: 7,
    dailyIncome: 3.50,
    totalReturn: 24.50,
    roiPercentage: 122.5,
    hashRate: '25.0 GH/s',
    status: 'hot' as const,
    popular: true,
    description: 'Special 7-day SK buying machine plan. Earn $3.50 daily with guaranteed yield collection.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'sk_power_50',
    name: 'SK Power Machine 2.0',
    tag: 'POPULAR MID-TIER',
    price: 50,
    durationDays: 15,
    dailyIncome: 5.00,
    totalReturn: 75.00,
    roiPercentage: 150.0,
    hashRate: '65.0 GH/s',
    status: 'available' as const,
    description: 'High efficiency SK rental unit with 15-day continuous power generation and $5.00 daily returns.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'sk_rig_100',
    name: 'SK Mining Rig Pro 3.0',
    tag: '30-DAY HIGH ROI',
    price: 100,
    durationDays: 30,
    dailyIncome: 8.00,
    totalReturn: 240.00,
    roiPercentage: 240.0,
    hashRate: '150.0 GH/s',
    status: 'available' as const,
    description: 'Institutional grade SK machine with 30-day runtime producing $8.00 daily passive revenue.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'sk_super_250',
    name: 'SK Super Hash 4.0',
    tag: 'VIP ENTERPRISE',
    price: 250,
    durationDays: 45,
    dailyIncome: 15.00,
    totalReturn: 675.00,
    roiPercentage: 270.0,
    hashRate: '400.0 GH/s',
    status: 'available' as const,
    description: 'Ultra high-speed multi-core SK buying machine with maximum throughput and daily yield payouts.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'sk_mega_500',
    name: 'SK Mega Node 5.0',
    tag: 'ULTIMATE MASTER PLAN',
    price: 500,
    durationDays: 60,
    dailyIncome: 35.00,
    totalReturn: 2100.00,
    roiPercentage: 420.0,
    hashRate: '1,200.0 GH/s',
    status: 'available' as const,
    description: 'Top tier SK master node machine generating $35 daily profit for 60 days straight.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
  }
];

export const initialActiveMachines = [
  {
    id: 'act_demo_1',
    userId: 'usr_demo_101',
    machineId: 'sk_starter_20',
    machineName: 'SK Starter Machine 1.0 ($20 / 7 Days)',
    purchasePrice: 20.00,
    dailyIncome: 3.50,
    durationDays: 7,
    daysCompleted: 1,
    totalEarnedSoFar: 3.50,
    purchaseDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastClaimDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    canClaimToday: true,
    status: 'active' as const
  }
];

