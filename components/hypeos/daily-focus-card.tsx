'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Star,
  Zap,
  Target,
  TrendingUp,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { SkillStrengthBadge } from './skill-strength-indicator';
import { type SkillStrength } from '@/lib/hypeos/spaced-repetition';
import { NumberCounter } from './celebration';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  impact: 'high' | 'medium' | 'low';
  estimatedTime?: string;
  category?: string;
  skillStrength?: SkillStrength | null; // Phase 2: Skill decay data
  howToComplete?: string[]; // Step-by-step instructions
  completedAt?: string; // ISO timestamp when task was completed (for accurate daily tracking)
}

interface DailyFocusCardProps {
  tasks: Task[];
  onTaskComplete: (taskId: number) => void;
  onTaskSkip: (taskId: number) => void;
  streak: number;
  momentumMultiplier: number;
  onMoreTasksClick?: () => void;
}

export default function DailyFocusCard({ 
  tasks, 
  onTaskComplete, 
  onTaskSkip, 
  streak, 
  momentumMultiplier,
  onMoreTasksClick
}: DailyFocusCardProps) {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [skippedTasks, setSkippedTasks] = useState<number[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  const handleComplete = (taskId: number) => {
    setCompletedTasks(prev => [...prev, taskId]);
    onTaskComplete(taskId);
  };

  const handleSkip = (taskId: number) => {
    setSkippedTasks(prev => [...prev, taskId]);
    onTaskSkip(taskId);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    // Return empty string - no emojis
    return '';
  };

  const getCategoryIcon = (category?: string) => {
    // Return empty string - no emojis
    return '';
  };

  // Only count tasks completed TODAY (very accurate tracking)
  const today = new Date().toDateString();
  const completedCount = tasks.filter(task => {
    if (!task.completed) return false;
    // If task has completedAt timestamp, check if it's today
    if (task.completedAt) {
      const completedDate = new Date(task.completedAt).toDateString();
      return completedDate === today;
    }
    // If no timestamp but completed is true, don't count it (prevents false positives)
    return false;
  }).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getMotivationalMessage = (rate: number) => {
    if (rate === 100) return "Perfect day! Ready for more?";
    if (rate >= 80) return "Amazing progress! Keep it up!";
    if (rate >= 60) return "Great momentum! You're on fire!";
    if (rate >= 40) return "Good progress! Keep pushing!";
    if (rate >= 20) return "Getting there! Every task counts!";
    return "Let's tackle these tasks together!";
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Today's Focus</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedCount}/{totalCount}
            </span>
            {momentumMultiplier > 1 && (
              <span className="text-xs text-gray-600 dark:text-gray-400 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                {momentumMultiplier}x
              </span>
            )}
          </div>
        </div>
        
        {/* Minimal Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(completionRate)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#39d2c0] rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          // Only show as completed if it was completed TODAY
          const today = new Date().toDateString();
          const wasCompletedToday = task.completed && task.completedAt 
            ? new Date(task.completedAt).toDateString() === today
            : false;
          const isCompleted = wasCompletedToday || completedTasks.includes(task.id);
          const isSkipped = skippedTasks.includes(task.id);
          
          return (
            <div 
              key={task.id}
              id={`task-${task.id}`}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-150 ${
                isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : isSkipped
                  ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-50'
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 hover:border-[#39d2c0]/50'
              }`}
            >
              {/* Minimal Checkbox */}
                <div 
                  className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all duration-150 mt-0.5 flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-[#39d2c0] border-[#39d2c0]' 
                      : 'border-gray-300 dark:border-gray-700 hover:border-[#39d2c0]'
                  }`}
                  onClick={() => !isCompleted && !isSkipped && handleComplete(task.id)}
                >
                  {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                </div>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed mb-2 ${
                  isCompleted 
                    ? 'text-gray-500 dark:text-gray-500 line-through' 
                    : isSkipped
                    ? 'text-gray-500 dark:text-gray-500 line-through'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {task.title}
                </p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    task.impact === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                    task.impact === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                    'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  }`}>
                    {task.impact}
                  </span>
                  {task.skillStrength && task.skillStrength.strength > 0 && (
                    <SkillStrengthBadge
                      strength={task.skillStrength.strength}
                      level={task.skillStrength.level}
                      daysUntilDecay={task.skillStrength.daysUntilDecay}
                      isOverdue={task.skillStrength.isOverdue}
                    />
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    +{Math.round(task.points * momentumMultiplier)} pts
                  </span>
                  {task.estimatedTime && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.estimatedTime}
                    </span>
                  )}
                </div>
                    
                    {/* How to Complete Section */}
                    {task.howToComplete && task.howToComplete.length > 0 && !isCompleted && (
                      <div className="mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newExpanded = new Set(expandedTasks);
                            if (newExpanded.has(task.id)) {
                              newExpanded.delete(task.id);
                            } else {
                              newExpanded.add(task.id);
                            }
                            setExpandedTasks(newExpanded);
                          }}
                          className="flex items-center gap-1.5 text-xs text-[#39d2c0] hover:text-[#2bb3a3] transition-colors font-medium"
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedTasks.has(task.id) ? 'rotate-180' : ''}`} />
                          <span>How to complete this task</span>
                        </button>
                        
                        {expandedTasks.has(task.id) && (
                          <div className="mt-2 pl-4 border-l-2 border-[#39d2c0]/30">
                            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                              {task.howToComplete.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-[#39d2c0] mt-0.5 flex-shrink-0">•</span>
                                  <span className="flex-1 leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
              </div>

              {/* Action Buttons */}
              {!isCompleted && !isSkipped && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Complete
                  </button>
                </div>
              )}

              {isCompleted && (
                <div className="flex items-center gap-1 text-[#39d2c0] flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Minimal Stats */}
      {streak >= 3 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="h-4 w-4" />
            <span>{streak} day streak = {momentumMultiplier}x multiplier</span>
          </div>
        </div>
      )}

      {/* More Tasks Button */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => {
            if (onMoreTasksClick) {
              onMoreTasksClick();
            }
          }}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-2"
        >
          <span>More tasks</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
