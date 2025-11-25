'use client';

import { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Zap,
  Flame,
  Star
} from 'lucide-react';

interface HypeMeterProps {
  progress: number;
  streak: number;
  level: number;
  points: number;
  goalTitle: string;
  goalCurrent: string;
  goalTarget: string;
}

export default function HypeMeter({ 
  progress, 
  streak, 
  level, 
  points, 
  goalTitle, 
  goalCurrent, 
  goalTarget 
}: HypeMeterProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 500);
    return () => clearTimeout(timer);
  }, [progress]);

  const getLevelInfo = (level: number) => {
    const levelData = {
      1: { name: "Rookie", color: "text-gray-600", nextLevel: 100, description: "Just getting started" },
      2: { name: "Explorer", color: "text-green-600", nextLevel: 250, description: "Building momentum" },
      3: { name: "Achiever", color: "text-blue-600", nextLevel: 500, description: "Making progress" },
      4: { name: "Expert", color: "text-purple-600", nextLevel: 1000, description: "Getting skilled" },
      5: { name: "Master", color: "text-orange-600", nextLevel: 2000, description: "Highly proficient" },
      6: { name: "Champion", color: "text-red-600", nextLevel: 5000, description: "Elite performer" },
      7: { name: "Legend", color: "text-yellow-600", nextLevel: 10000, description: "Legendary status" },
      8: { name: "Mythic", color: "text-pink-600", nextLevel: 25000, description: "Mythical achievement" },
      9: { name: "Transcendent", color: "text-indigo-600", nextLevel: 50000, description: "Beyond limits" },
      10: { name: "Supreme", color: "text-cyan-600", nextLevel: 100000, description: "Ultimate mastery" }
    };
    
    return levelData[level as keyof typeof levelData] || levelData[1];
  };

  const getNextLevelProgress = (points: number, level: number) => {
    const levelInfo = getLevelInfo(level);
    const currentLevelStart = level === 1 ? 0 : getLevelInfo(level - 1).nextLevel;
    const progress = ((points - currentLevelStart) / (levelInfo.nextLevel - currentLevelStart)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const levelInfo = getLevelInfo(level);
  const nextLevelProgress = getNextLevelProgress(points, level);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Progress</h2>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className={`text-sm font-medium ${levelInfo.color}`}>
              Level {level}
            </span>
          </div>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="relative w-24 h-24 mx-auto mb-6">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-200 dark:text-gray-800"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#39d2c0"
            strokeWidth="2"
            strokeDasharray={`${animatedProgress}, 100`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(animatedProgress)}%
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Goal</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {goalCurrent} / {goalTarget}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#39d2c0] rounded-full transition-all duration-500"
            style={{ width: `${animatedProgress}%` }}
          />
        </div>
      </div>

      {/* Level Progress */}
      <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Next Level</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round(nextLevelProgress)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${nextLevelProgress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {points.toLocaleString()} / {levelInfo.nextLevel.toLocaleString()} points
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{streak}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#39d2c0]" />
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{points.toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
          </div>
        </div>
      </div>
    </div>
  );
}
