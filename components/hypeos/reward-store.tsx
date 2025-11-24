'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Gift, 
  Lock, 
  Star, 
  Crown,
  Zap,
  Target,
  Users,
  BookOpen,
  Settings,
  Sparkles,
  ArrowLeft,
  Mail,
  Smartphone,
  BarChart3,
  ClipboardList,
  User,
  FileText,
  TrendingUp,
  Rocket,
  Palette,
  Bot,
  Handshake,
  Medal,
  Award,
  Trophy,
  Presentation,
  Clock,
  Calendar
} from 'lucide-react';

interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  category: 'templates' | 'courses' | 'tools' | 'perks' | 'premium';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  icon: React.ComponentType<{ className?: string }>;
  comingSoon?: boolean;
}

interface RewardStoreProps {
  userPoints: number;
  onRedeemReward: (rewardId: number, points: number) => void;
}

export default function RewardStore({ userPoints, onRedeemReward }: RewardStoreProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const rewards: Reward[] = [
    // ========== BRONZE TIER (0-1k points) ==========
    // Templates
    {
      id: 1,
      title: "Email Template Pack",
      description: "10 professional email templates for outreach",
      points: 200,
      category: 'templates',
      tier: 'bronze',
      unlocked: userPoints >= 200,
      icon: Mail
    },
    {
      id: 2,
      title: "Social Media Templates",
      description: "20 ready-to-use social media post templates",
      points: 300,
      category: 'templates',
      tier: 'bronze',
      unlocked: userPoints >= 300,
      icon: Smartphone
    },
    {
      id: 15,
      title: "LinkedIn Post Templates",
      description: "15 professional LinkedIn post templates",
      points: 250,
      category: 'templates',
      tier: 'bronze',
      unlocked: userPoints >= 250,
      icon: FileText
    },
    {
      id: 16,
      title: "Pitch Deck Template",
      description: "Professional pitch deck template with 10 slides",
      points: 400,
      category: 'templates',
      tier: 'bronze',
      unlocked: userPoints >= 400,
      icon: Presentation
    },
    {
      id: 17,
      title: "Invoice Template Pack",
      description: "5 professional invoice templates",
      points: 150,
      category: 'templates',
      tier: 'bronze',
      unlocked: userPoints >= 150,
      icon: FileText
    },
    {
      id: 18,
      title: "Proposal Template Bundle",
      description: "10 client proposal templates",
      points: 350,
      category: 'templates',
      tier: 'bronze',
      unlocked: userPoints >= 350,
      icon: FileText
    },
    
    // Courses
    {
      id: 3,
      title: "Basic Analytics Course",
      description: "Learn to track your business metrics",
      points: 500,
      category: 'courses',
      tier: 'bronze',
      unlocked: userPoints >= 500,
      icon: BarChart3
    },
    {
      id: 19,
      title: "Introduction to Marketing",
      description: "Marketing fundamentals for beginners",
      points: 400,
      category: 'courses',
      tier: 'bronze',
      unlocked: userPoints >= 400,
      icon: Target
    },
    {
      id: 20,
      title: "Time Management Basics",
      description: "Learn effective time management strategies",
      points: 300,
      category: 'courses',
      tier: 'bronze',
      unlocked: userPoints >= 300,
      icon: Clock
    },
    {
      id: 21,
      title: "Social Media 101",
      description: "Complete guide to social media marketing",
      points: 450,
      category: 'courses',
      tier: 'bronze',
      unlocked: userPoints >= 450,
      icon: Smartphone
    },
    
    // Tools
    {
      id: 22,
      title: "Goal Tracker Spreadsheet",
      description: "Excel template for tracking business goals",
      points: 200,
      category: 'tools',
      tier: 'bronze',
      unlocked: userPoints >= 200,
      icon: ClipboardList
    },
    {
      id: 23,
      title: "Expense Tracker Tool",
      description: "Simple expense tracking spreadsheet",
      points: 250,
      category: 'tools',
      tier: 'bronze',
      unlocked: userPoints >= 250,
      icon: BarChart3
    },
    {
      id: 24,
      title: "Content Calendar Template",
      description: "Monthly content planning calendar",
      points: 300,
      category: 'tools',
      tier: 'bronze',
      unlocked: userPoints >= 300,
      icon: Calendar
    },
    
    // Perks
    {
      id: 25,
      title: "Early Access to Features",
      description: "Get early access to new platform features",
      points: 500,
      category: 'perks',
      tier: 'bronze',
      unlocked: userPoints >= 500,
      icon: Sparkles
    },
    {
      id: 26,
      title: "Profile Badge",
      description: "Exclusive bronze tier profile badge",
      points: 400,
      category: 'perks',
      tier: 'bronze',
      unlocked: userPoints >= 400,
      icon: Award
    },

    // ========== SILVER TIER (1k-5k points) ==========
    // Courses
    {
      id: 4,
      title: "Advanced Marketing Course",
      description: "Complete marketing strategy course",
      points: 1200,
      category: 'courses',
      tier: 'silver',
      unlocked: userPoints >= 1200,
      icon: Target
    },
    {
      id: 27,
      title: "Sales Funnel Mastery",
      description: "Build and optimize sales funnels",
      points: 1500,
      category: 'courses',
      tier: 'silver',
      unlocked: userPoints >= 1500,
      icon: TrendingUp
    },
    {
      id: 28,
      title: "Email Marketing Pro",
      description: "Advanced email marketing strategies",
      points: 1800,
      category: 'courses',
      tier: 'silver',
      unlocked: userPoints >= 1800,
      icon: Mail
    },
    {
      id: 29,
      title: "SEO Optimization Course",
      description: "Master search engine optimization",
      points: 2000,
      category: 'courses',
      tier: 'silver',
      unlocked: userPoints >= 2000,
      icon: TrendingUp
    },
    {
      id: 30,
      title: "Financial Planning for Business",
      description: "Learn business financial management",
      points: 2200,
      category: 'courses',
      tier: 'silver',
      unlocked: userPoints >= 2200,
      icon: BarChart3
    },
    
    // Tools
    {
      id: 5,
      title: "CRM Setup Guide",
      description: "Step-by-step CRM implementation",
      points: 800,
      category: 'tools',
      tier: 'silver',
      unlocked: userPoints >= 800,
      icon: ClipboardList
    },
    {
      id: 31,
      title: "Marketing Automation Tool",
      description: "Access to marketing automation platform",
      points: 2500,
      category: 'tools',
      tier: 'silver',
      unlocked: userPoints >= 2500,
      icon: Bot
    },
    {
      id: 32,
      title: "Advanced Analytics Dashboard",
      description: "Professional analytics dashboard access",
      points: 1800,
      category: 'tools',
      tier: 'silver',
      unlocked: userPoints >= 1800,
      icon: BarChart3
    },
    {
      id: 33,
      title: "Project Management Tool",
      description: "Premium project management software access",
      points: 2000,
      category: 'tools',
      tier: 'silver',
      unlocked: userPoints >= 2000,
      icon: ClipboardList
    },
    {
      id: 34,
      title: "Social Media Scheduler",
      description: "Advanced social media scheduling tool",
      points: 1500,
      category: 'tools',
      tier: 'silver',
      unlocked: userPoints >= 1500,
      icon: Smartphone
    },
    
    // Perks
    {
      id: 6,
      title: "Priority Support",
      description: "Get faster support responses",
      points: 1000,
      category: 'perks',
      tier: 'silver',
      unlocked: userPoints >= 1000,
      icon: Zap
    },
    {
      id: 35,
      title: "Monthly Q&A Session",
      description: "Join monthly Q&A with experts",
      points: 1200,
      category: 'perks',
      tier: 'silver',
      unlocked: userPoints >= 1200,
      icon: Users
    },
    {
      id: 36,
      title: "Silver Profile Badge",
      description: "Exclusive silver tier profile badge",
      points: 1500,
      category: 'perks',
      tier: 'silver',
      unlocked: userPoints >= 1500,
      icon: Award
    },
    {
      id: 37,
      title: "Feature Request Priority",
      description: "Your feature requests get priority",
      points: 2000,
      category: 'perks',
      tier: 'silver',
      unlocked: userPoints >= 2000,
      icon: Star
    },
    {
      id: 38,
      title: "Community Moderator Access",
      description: "Help moderate the community",
      points: 1800,
      category: 'perks',
      tier: 'silver',
      unlocked: userPoints >= 1800,
      icon: Users
    },

    // ========== GOLD TIER (5k-10k points) ==========
    // Perks
    {
      id: 7,
      title: "1-on-1 Mentor Session",
      description: "30-minute session with business expert",
      points: 5000,
      category: 'perks',
      tier: 'gold',
      unlocked: userPoints >= 5000,
      icon: User
    },
    {
      id: 39,
      title: "Extended Mentor Session",
      description: "60-minute deep dive with expert",
      points: 8000,
      category: 'perks',
      tier: 'gold',
      unlocked: userPoints >= 8000,
      icon: User
    },
    {
      id: 40,
      title: "Monthly Mastermind Group",
      description: "Join exclusive monthly mastermind",
      points: 6000,
      category: 'perks',
      tier: 'gold',
      unlocked: userPoints >= 6000,
      icon: Users
    },
    {
      id: 41,
      title: "Gold Profile Badge",
      description: "Exclusive gold tier profile badge",
      points: 5500,
      category: 'perks',
      tier: 'gold',
      unlocked: userPoints >= 5500,
      icon: Award
    },
    {
      id: 42,
      title: "VIP Customer Support",
      description: "24/7 dedicated support line",
      points: 7000,
      category: 'perks',
      tier: 'gold',
      unlocked: userPoints >= 7000,
      icon: Zap
    },
    
    // Tools
    {
      id: 8,
      title: "Custom Business Plan",
      description: "Personalized business strategy document",
      points: 3000,
      category: 'tools',
      tier: 'gold',
      unlocked: userPoints >= 3000,
      icon: FileText
    },
    {
      id: 9,
      title: "Premium Analytics Dashboard",
      description: "Advanced tracking and insights",
      points: 2500,
      category: 'tools',
      tier: 'gold',
      unlocked: userPoints >= 2500,
      icon: TrendingUp
    },
    {
      id: 43,
      title: "Custom CRM Setup",
      description: "Personalized CRM configuration",
      points: 4500,
      category: 'tools',
      tier: 'gold',
      unlocked: userPoints >= 4500,
      icon: Settings
    },
    {
      id: 44,
      title: "AI Marketing Assistant",
      description: "AI-powered marketing strategy tool",
      points: 6000,
      category: 'tools',
      tier: 'gold',
      unlocked: userPoints >= 6000,
      icon: Bot
    },
    {
      id: 45,
      title: "Advanced Reporting Suite",
      description: "Comprehensive business reporting tools",
      points: 5000,
      category: 'tools',
      tier: 'gold',
      unlocked: userPoints >= 5000,
      icon: BarChart3
    },
    
    // Courses
    {
      id: 46,
      title: "Business Mastery Program",
      description: "12-week comprehensive business program",
      points: 8000,
      category: 'courses',
      tier: 'gold',
      unlocked: userPoints >= 8000,
      icon: Rocket
    },
    {
      id: 47,
      title: "Advanced Sales Training",
      description: "Master-level sales techniques",
      points: 7000,
      category: 'courses',
      tier: 'gold',
      unlocked: userPoints >= 7000,
      icon: Target
    },
    {
      id: 48,
      title: "Leadership Development",
      description: "Build your leadership skills",
      points: 6500,
      category: 'courses',
      tier: 'gold',
      unlocked: userPoints >= 6500,
      icon: Users
    },

    // ========== PLATINUM TIER (10k+ points) ==========
    // Perks
    {
      id: 10,
      title: "VIP Mastermind Access",
      description: "Join exclusive entrepreneur group",
      points: 10000,
      category: 'perks',
      tier: 'platinum',
      unlocked: userPoints >= 10000,
      icon: Crown
    },
    {
      id: 49,
      title: "Lifetime Premium Access",
      description: "Lifetime access to all premium features",
      points: 25000,
      category: 'perks',
      tier: 'platinum',
      unlocked: userPoints >= 25000,
      icon: Crown
    },
    {
      id: 50,
      title: "Platinum Profile Badge",
      description: "Ultimate platinum tier profile badge",
      points: 12000,
      category: 'perks',
      tier: 'platinum',
      unlocked: userPoints >= 12000,
      icon: Trophy
    },
    {
      id: 51,
      title: "Personal Business Consultant",
      description: "Dedicated consultant for your business",
      points: 20000,
      category: 'perks',
      tier: 'platinum',
      unlocked: userPoints >= 20000,
      icon: User
    },
    {
      id: 52,
      title: "Annual Conference Pass",
      description: "VIP access to annual business conference",
      points: 15000,
      category: 'perks',
      tier: 'platinum',
      unlocked: userPoints >= 15000,
      icon: Users
    },
    
    // Tools
    {
      id: 11,
      title: "Custom Brand Kit",
      description: "Professional logo and brand assets",
      points: 8000,
      category: 'tools',
      tier: 'platinum',
      unlocked: userPoints >= 8000,
      icon: Palette
    },
    {
      id: 53,
      title: "Enterprise Software Suite",
      description: "Full enterprise software package",
      points: 30000,
      category: 'tools',
      tier: 'platinum',
      unlocked: userPoints >= 30000,
      icon: Settings
    },
    {
      id: 54,
      title: "Custom Website Development",
      description: "Professional website built for you",
      points: 35000,
      category: 'tools',
      tier: 'platinum',
      unlocked: userPoints >= 35000,
      icon: Rocket
    },
    {
      id: 55,
      title: "AI Business Assistant",
      description: "Custom AI assistant for your business",
      points: 25000,
      category: 'tools',
      tier: 'platinum',
      unlocked: userPoints >= 25000,
      icon: Bot
    },
    
    // Courses
    {
      id: 12,
      title: "Business Accelerator Program",
      description: "6-month intensive growth program",
      points: 15000,
      category: 'courses',
      tier: 'platinum',
      unlocked: userPoints >= 15000,
      icon: Rocket
    },
    {
      id: 56,
      title: "Executive MBA Program",
      description: "Complete executive business education",
      points: 40000,
      category: 'courses',
      tier: 'platinum',
      unlocked: userPoints >= 40000,
      icon: BookOpen
    },
    {
      id: 57,
      title: "Master Entrepreneur Program",
      description: "Year-long masterclass program",
      points: 30000,
      category: 'courses',
      tier: 'platinum',
      unlocked: userPoints >= 30000,
      icon: Trophy
    },

    // ========== COMING SOON ==========
    {
      id: 13,
      title: "AI Content Generator",
      description: "AI-powered content creation tool",
      points: 2000,
      category: 'tools',
      tier: 'silver',
      unlocked: false,
      icon: Bot,
      comingSoon: true
    },
    {
      id: 14,
      title: "Networking Event Access",
      description: "Exclusive networking events",
      points: 3000,
      category: 'perks',
      tier: 'gold',
      unlocked: false,
      icon: Handshake,
      comingSoon: true
    },
    {
      id: 58,
      title: "Mobile App Access",
      description: "Native mobile app for iOS and Android",
      points: 5000,
      category: 'tools',
      tier: 'gold',
      unlocked: false,
      icon: Smartphone,
      comingSoon: true
    },
    {
      id: 59,
      title: "API Access",
      description: "Developer API for integrations",
      points: 8000,
      category: 'tools',
      tier: 'platinum',
      unlocked: false,
      icon: Settings,
      comingSoon: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Rewards', icon: Gift },
    { value: 'templates', label: 'Templates', icon: BookOpen },
    { value: 'courses', label: 'Courses', icon: Target },
    { value: 'tools', label: 'Tools', icon: Settings },
    { value: 'perks', label: 'Perks', icon: Star }
  ];

  const tiers = [
    { value: 'all', label: 'All Tiers', color: 'bg-gray-100 text-gray-800' },
    { value: 'bronze', label: 'Bronze', color: 'bg-orange-100 text-orange-800' },
    { value: 'silver', label: 'Silver', color: 'bg-gray-100 text-gray-800' },
    { value: 'gold', label: 'Gold', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'platinum', label: 'Platinum', color: 'bg-purple-100 text-purple-800' }
  ];

  const filteredRewards = rewards.filter(reward => {
    const categoryMatch = selectedCategory === 'all' || reward.category === selectedCategory;
    const tierMatch = selectedTier === 'all' || reward.tier === selectedTier;
    return categoryMatch && tierMatch;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTierIcon = (tier: string) => {
    const iconClass = "h-4 w-4";
    switch (tier) {
      case 'bronze': return <Medal className={`${iconClass} text-orange-500`} />;
      case 'silver': return <Award className={`${iconClass} text-gray-400`} />;
      case 'gold': return <Trophy className={`${iconClass} text-yellow-500`} />;
      case 'platinum': return <Crown className={`${iconClass} text-purple-500`} />;
      default: return <Star className={`${iconClass} text-[#39d2c0]`} />;
    }
  };

  const canAfford = (points: number) => userPoints >= points;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-8 py-16 pt-28">
        {/* Back Button */}
        <div className="mb-12">
          <button 
            onClick={() => router.push('/hypeos')}
            className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* Header - Ultra Minimal */}
        <div className="mb-16">
          <h1 className="text-5xl font-normal text-gray-900 dark:text-white mb-2 tracking-tight">
            Rewards
          </h1>
          <div className="flex items-center gap-4 mt-6 text-sm text-gray-500 dark:text-gray-500">
            <span>{userPoints.toLocaleString()} points available</span>
          </div>
        </div>

        {/* Filters - Ultra Minimal */}
        <div className="mb-8 pb-6 border-b border-gray-100 dark:border-gray-900">
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.value;
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm transition-colors rounded-md ${
                        isSelected
                          ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tier Filter */}
            <div>
              <div className="flex flex-wrap gap-1">
                {tiers.map((tier) => {
                  const isSelected = selectedTier === tier.value;
                  return (
                    <button
                      key={tier.value}
                      onClick={() => setSelectedTier(tier.value)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 text-sm transition-colors rounded-md ${
                        isSelected
                          ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900"
                      }`}
                    >
                      {tier.value !== 'all' && (
                        <span className="w-3.5 h-3.5">{getTierIcon(tier.value)}</span>
                      )}
                      <span>{tier.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Rewards List - Container Style - Full Width */}
        <div className="space-y-3 mb-16">
          {filteredRewards.map((reward) => {
            const getTierBadgeColor = (tier: string) => {
              switch (tier) {
                case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
                case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
                case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                case 'platinum': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
                default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
              }
            };

            return (
              <div 
                key={reward.id} 
                className={`p-5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-slate-900 transition-all w-full ${
                  !reward.unlocked || reward.comingSoon 
                    ? 'opacity-60' 
                    : 'hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Left side - Icon and content */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-0.5">
                      <reward.icon className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                          {reward.title}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getTierBadgeColor(reward.tier)}`}>
                          {reward.tier}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {reward.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-900 dark:text-white font-medium">
                          +{reward.points.toLocaleString()} pts
                        </span>
                        {reward.comingSoon && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">Coming soon</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Action button */}
                  <div className="flex-shrink-0">
                    {reward.comingSoon ? (
                      <button 
                        disabled
                        className="px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    ) : reward.unlocked ? (
                      <button 
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                        onClick={() => onRedeemReward(reward.id, reward.points)}
                      >
                        Redeem
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md cursor-not-allowed"
                      >
                        Locked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Points Guide - At Bottom */}
        <div className="pt-12 border-t border-gray-100 dark:border-gray-900">
          <h2 className="text-lg font-normal text-gray-900 dark:text-white mb-6">
            How to earn points
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-500">
                <li>Complete daily tasks (100-500 points)</li>
                <li>Finish mini wins (25-50 points)</li>
                <li>Maintain streaks (bonus multipliers)</li>
                <li>Hit milestones (500-2000 points)</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-500">
                <li>Help others in squads (100 points)</li>
                <li>Complete challenges (300-1000 points)</li>
                <li>Share achievements (50 points)</li>
                <li>Invite friends (500 points)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
