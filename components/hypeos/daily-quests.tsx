'use client';

import { useState, useEffect } from 'react';
import { 
  Target, 
  Zap, 
  Trophy, 
  Flame,
  Gift,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { 
  Quest, 
  getQuestCompletionRate,
  getTotalQuestRewards
} from '@/lib/hypeos/quest-system';

interface DailyQuestsProps {
  tasks: any[];
  userPoints: number;
  streak: number;
  quests: Quest[];
  onQuestComplete?: (rewards: number) => void;
}

export default function DailyQuests({ 
  tasks, 
  userPoints, 
  streak, 
  quests,
  onQuestComplete 
}: DailyQuestsProps) {
  const [completedRewards, setCompletedRewards] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const completedQuests = quests.filter(q => q.completed);
    const totalRewards = completedQuests.reduce((sum, quest) => sum + quest.reward, 0);
    setCompletedRewards(totalRewards);
  }, [quests]);

  const getQuestIcon = (icon: string, isCompleted: boolean = false) => {
    const baseClasses = "h-5 w-5";
    
    switch (icon) {
      case '⚡': 
        return <Zap className={`${baseClasses} ${isCompleted ? 'text-green-500' : 'text-yellow-500'}`} />;
      case '🎯': 
        return <Target className={`${baseClasses} ${isCompleted ? 'text-green-500' : 'text-[#39d2c0]'}`} />;
      case '🔥': 
        return <Flame className={`${baseClasses} ${isCompleted ? 'text-green-500' : 'text-orange-500'}`} />;
      case '🏆': 
        return <Trophy className={`${baseClasses} ${isCompleted ? 'text-green-500' : 'text-purple-500'}`} />;
      default: 
        return <Target className={`${baseClasses} ${isCompleted ? 'text-green-500' : 'text-gray-500'}`} />;
    }
  };

  const completionRate = getQuestCompletionRate(quests);
  const totalRewards = getTotalQuestRewards(quests);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Daily Quests
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete quests to earn bonus rewards
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completionRate}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {quests.filter(q => q.completed).length}/{quests.length} completed
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#39d2c0] rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Quest Cards */}
      <div className="space-y-3">
        {quests.map((quest) => {
          const progressPercentage = (quest.current / quest.target) * 100;
          const isCompleted = quest.completed;
          
          return (
            <div
              key={quest.id}
              className={`p-4 rounded-lg border transition-all duration-150 ${
                isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 hover:border-[#39d2c0]'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {getQuestIcon(quest.icon, isCompleted)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-medium text-sm ${
                      isCompleted 
                        ? 'text-green-800 dark:text-green-200' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {quest.title}
                    </h3>
                    {isCompleted && (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {quest.description}
                  </p>
                  
                  {/* Progress */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        {quest.current} / {quest.target}
                      </span>
                      <div className="flex items-center gap-1">
                        <Gift className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                          +{quest.reward} XP
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-1 rounded-full transition-all duration-500 ${
                          isCompleted 
                            ? 'bg-green-500' 
                            : 'bg-[#39d2c0]'
                        }`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {completionRate}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Complete
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {totalRewards}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total Rewards
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {completedRewards}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Earned Today
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
