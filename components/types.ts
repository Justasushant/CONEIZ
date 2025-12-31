
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Changed to string for animated URL support
  details: string[];
}

export interface ProductPlan {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}
