
import { 
  Cloud, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Database, 
  Code, 
  Globe,
  Lock,
  Server,
  Layout,
  TrendingUp,
  Smartphone,
  Globe2
} from 'lucide-react';
import { NavItem, Feature, Service, ProductPlan, TeamMember, BlogPost } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Pricing', path: '/products' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export const HERO_ILLUSTRATION_URL = "https://i.postimg.cc/MZFVT042/illus1.jpg";
export const SERVICE_ILLUSTRATION_URL = "https://i.postimg.cc/wv82vCB8/illus1.png";

export const KEY_FEATURES: Feature[] = [
  {
    title: 'Cloud Platform',
    description: 'Scalable infrastructure that grows with your business demands, offering 99.99% uptime.',
    icon: Cloud,
  },
  {
    title: 'Intelligent Automation',
    description: 'Streamline workflows with AI-driven automation tools designed for enterprise efficiency.',
    icon: Zap,
  },
  {
    title: 'Secure Infrastructure',
    description: 'Enterprise-grade security protocols ensuring your data remains protected at all times.',
    icon: ShieldCheck,
  },
  {
    title: 'Developer Tools',
    description: 'Robust APIs and SDKs enabling developers to build the next generation of apps.',
    icon: Code,
  },
];

export const SERVICES: Service[] = [
  {
    id: 'cloud',
    title: 'Cloud Services',
    description: 'Next-gen cloud hosting and computing power.',
    icon: 'https://cdn-icons-gif.flaticon.com/19017/19017634.gif',
    details: ['Elastic Computing', 'Serverless Architecture', 'Global CDN'],
  },
  {
    id: 'saas',
    title: 'SaaS Tools',
    description: 'Productivity and management software suites.',
    icon: 'https://cdn-icons-gif.flaticon.com/19015/19015953.gif',
    details: ['Project Management', 'CRM Integration', 'Team Collaboration'],
  },
  {
    id: 'enterprise',
    title: 'Enterprise Solutions',
    description: 'Custom integration and massive scale support.',
    icon: 'https://cdn-icons-gif.flaticon.com/15713/15713168.gif',
    details: ['Custom ERP', 'Legacy Migration', '24/7 Dedicated Support'],
  },
  {
    id: 'web-app-dev',
    title: 'Web & App Development',
    description: 'Bespoke digital experiences built with performance and scale in mind.',
    icon: 'https://cdn-icons-gif.flaticon.com/15591/15591404.gif',
    details: ['React & Next.js Experts', 'Native Mobile Apps', 'Scalable Backend Architecture'],
  },
];

export const PRODUCT_PLANS: ProductPlan[] = [
  {
    name: 'Starter',
    price: '29',
    features: ['Basic Cloud Access', '10GB Storage', 'Community Support', '1 User'],
    recommended: false,
  },
  {
    name: 'Growth',
    price: '99',
    features: ['Priority Cloud Access', '1TB Storage', 'Email Support', 'Up to 10 Users', 'Analytics Dashboard'],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Unlimited Storage', '24/7 Phone Support', 'Unlimited Users', 'Dedicated Account Manager', 'Custom Integrations'],
    recommended: false,
  },
];

export const TEAM: TeamMember[] = [
  { name: 'Elena R.', role: 'CEO & Founder', image: 'https://picsum.photos/200/200?random=1' },
  { name: 'Marcus T.', role: 'CTO', image: 'https://picsum.photos/200/200?random=2' },
  { name: 'Sarah L.', role: 'Head of Product', image: 'https://picsum.photos/200/200?random=3' },
];

export const BLOG_POSTS: BlogPost[] = [];
