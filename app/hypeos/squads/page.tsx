'use client';

import { useRouter } from 'next/navigation';
import { HorizontalNav } from '@/components/horizontal-nav';
import { 
  Users, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function SquadsPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <HorizontalNav />
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

        {/* Coming Soon Content - Ultra Minimal */}
        <div className="mb-16">
          <h1 className="text-5xl font-normal text-gray-900 dark:text-white mb-4 tracking-tight">
            Squads
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-500 leading-relaxed">
            We're building an accountability feature where you can join forces with like-minded entrepreneurs, 
            stay motivated together, and achieve your goals as a team.
          </p>
        </div>

        {/* Features List - Ultra Minimal */}
        <div className="mb-16">
          <h2 className="text-lg font-normal text-gray-900 dark:text-white mb-8">What to expect</h2>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-500">
            <li>Join or create accountability squads</li>
            <li>Track squad streaks and progress together</li>
            <li>Chat and motivate each other</li>
            <li>Compete in squad challenges</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
