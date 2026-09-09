import type { Company, Job } from './types';

export const jobs: Job[] = [
  { id: 1, title: 'Full Stack Developer', company: 'NovaBridge' },
  { id: 2, title: 'UI/UX Designer', company: 'PixelForge' },
  { id: 3, title: 'Project Manager', company: 'BrightPath Labs' },
  { id: 4, title: 'Data Analyst', company: 'CloudPeak' },
  { id: 5, title: 'Web Designer', company: 'SparkWave' },
  { id: 6, title: 'Accounting Officer', company: 'GreenHorizon' },
];

export const jobCategoryRows = [
  ['Project Manager', 'Data Entry', 'Customer Service', 'Web Design', 'Bookkeeping', 'App Development'],
  ['Communication', 'Analyst', 'Graphic Design', 'Education', 'Sales', 'Virtual Assistant'],
  ['Developer', 'UI/UX Design', 'Marketing', 'Call Center', 'Accounting'],
];

export const avatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
];

export const companies: Company[] = [
  { name: 'Northstar', category: 'Bank', location: 'Phnom Penh', featured: true, bg: 'bg-[#002B49]', text: 'text-amber-400', logoText: 'BANK' },
  { name: 'Golden Dune', category: 'Hotel', location: 'Siem Reap', featured: false, bg: 'bg-amber-600', text: 'text-white', logoText: 'HOTEL' },
  { name: 'BlueHarbor', category: 'Finance', location: 'Phnom Penh', featured: false, highlighted: true, bg: 'bg-[#003B5C]', text: 'text-white', logoText: 'FIN' },
  { name: 'Evergrove', category: 'Microfinance', location: 'Battambang', featured: false, bg: 'bg-[#006837]', text: 'text-white', logoText: 'MFI' },
  { name: 'LimeOrbit', category: 'Digital Wallet', location: 'Kampot', featured: true, bg: 'bg-[#8CC63F]', text: 'text-white', logoText: 'PAY' },
  { name: 'ArcNova', category: 'Logistics', location: 'Phnom Penh', featured: false, bg: 'bg-[#0B2545]', text: 'text-white', logoText: 'SHIP' },
  { name: 'SunCircuit', category: 'Telecom', location: 'Sihanoukville', featured: false, bg: 'bg-[#FF6B00]', text: 'text-white', logoText: 'TEL' },
  { name: 'RedMango', category: 'Retail', location: 'Siem Reap', featured: false, bg: 'bg-[#ED1C24]', text: 'text-white', logoText: 'SHOP' },
];
