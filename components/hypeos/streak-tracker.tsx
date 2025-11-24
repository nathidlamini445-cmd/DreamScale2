'use client';

import { useState, useEffect } from 'react';
import { 
  Flame, 
  Calendar, 
  Target,
  TrendingUp,
  Star,
  Zap,
  Trophy,
  Crown
} from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  streakGoal: number;
  onStreakMilestone?: (milestone: string) => void;
}

export default function StreakTracker({ 
  currentStreak, 
  longestStreak, 
  totalDaysActive, 
  streakGoal,
  onStreakMilestone 
}: StreakTrackerProps) {
  const [animatedStreak, setAnimatedStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStreak(currentStreak);
      
      // Check for milestone celebrations
      if (currentStreak > 0 && currentStreak % 7 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        onStreakMilestone?.(`${currentStreak} day streak!`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentStreak, onStreakMilestone]);

  const getStreakLevel = (streak: number) => {
    if (streak >= 100) return { level: 'Legendary', color: 'text-purple-600 dark:text-purple-400', icon: Crown };
    if (streak >= 50) return { level: 'Epic', color: 'text-red-600 dark:text-red-400', icon: Trophy };
    if (streak >= 30) return { level: 'Master', color: 'text-orange-600 dark:text-orange-400', icon: Star };
    if (streak >= 21) return { level: 'Expert', color: 'text-yellow-600 dark:text-yellow-400', icon: Zap };
    if (streak >= 14) return { level: 'Advanced', color: 'text-green-600 dark:text-green-400', icon: TrendingUp };
    if (streak >= 7) return { level: 'Intermediate', color: 'text-blue-600 dark:text-blue-400', icon: Target };
    if (streak >= 3) return { level: 'Beginner', color: 'text-gray-600 dark:text-gray-400', icon: Calendar };
    return { level: 'Starting', color: 'text-gray-500 dark:text-gray-500', icon: Calendar };
  };

  const streakLevel = getStreakLevel(currentStreak);
  const streakProgress = Math.min((currentStreak / streakGoal) * 100, 100);

  const nextMilestone = () => {
    const milestones = [3, 7, 14, 21, 30, 50, 100];
    return milestones.find(milestone => milestone > currentStreak) || null;
  };

  const nextMilestoneValue = nextMilestone();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Streak</h2>
          <span className={`text-xs px-2 py-1 rounded ${streakLevel.color} bg-opacity-10`}>
            {streakLevel.level}
          </span>
        </div>
      </div>

      {/* Main Streak Display */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
          {animatedStreak}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          day streak
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {currentStreak}/{streakGoal}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${streakProgress}%` }}
          />
        </div>
        {nextMilestoneValue && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Next: {nextMilestoneValue} days ({nextMilestoneValue - currentStreak} more)
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {longestStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Longest</div>
        </div>
        <div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {totalDaysActive}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Days</div>
        </div>
      </div>

      {/* Recent Activity Calendar */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Recent Activity</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const dayOffset = 6 - i;
            const isActive = currentStreak > dayOffset;
            return (
              <div
                key={i}
                className={`w-8 h-8 rounded text-xs flex items-center justify-center ${
                  isActive 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                }`}
              >
                {dayOffset === 0 ? 'T' : dayOffset === 1 ? 'Y' : dayOffset}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
