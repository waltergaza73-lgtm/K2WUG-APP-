export interface User {
  id: string;
  name: string;
  email: string;
  role: 'individual' | 'provider' | 'employer';
  phone?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  walletBalance: number;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  priceUnit: 'hr' | 'fixed' | 'day';
  providerId: string;
  providerName: string;
  providerRating: number;
  providerAvatar?: string;
  location: string;
  tags: string[];
  imageUrl?: string;
  available: boolean;
  createdAt: string;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  category: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  location: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  employerId: string;
  applicationsCount: number;
  createdAt: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: string;
  price: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  description: string;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  imageUrl?: string;
  status: 'available' | 'sold';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'transfer' | 'earned';
  amount: number;
  title: string;
  recipientOrSender?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  activeServices: number;
  openJobs: number;
  marketplaceItems: number;
  processedTransactions: number;
}

export type PageName = 
  | 'home'
  | 'about'
  | 'machines'
  | 'services'
  | 'jobs'
  | 'marketplace'
  | 'wallet'
  | 'dashboard'
  | 'login'
  | 'register'
  | 'profile'
  | 'contact';

export interface BuyingMachine {
  id: string;
  name: string;
  tag: string;
  price: number;
  durationDays: number;
  dailyIncome: number;
  totalReturn: number;
  roiPercentage: number;
  hashRate: string;
  status: 'available' | 'sold_out' | 'hot';
  imageUrl?: string;
  description: string;
  popular?: boolean;
}

export interface UserActiveMachine {
  id: string;
  machineId: string;
  machineName: string;
  purchasePrice: number;
  dailyIncome: number;
  durationDays: number;
  daysCompleted: number;
  totalEarnedSoFar: number;
  purchaseDate: string;
  lastClaimDate?: string;
  canClaimToday: boolean;
  status: 'active' | 'completed';
}
