'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Clock, 
  Star,
  Flame,
  Target,
  CheckCircle
} from 'lucide-react';

interface MiniWin {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  time: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  completedAt?: string; // ISO timestamp when miniWin was completed (for accurate daily tracking)
}

interface MiniWinsProps {
  miniWins: MiniWin[];
  onComplete: (miniWinId: number) => void;
  streak: number;
}

export default function MiniWins({ miniWins, onComplete, streak }: MiniWinsProps) {
  const [completedWins, setCompletedWins] = useState<number[]>([]);
  const [animatingId, setAnimatingId] = useState<number | null>(null);

  const handleComplete = (miniWinId: number) => {
    setAnimatingId(miniWinId);
    setCompletedWins(prev => [...prev, miniWinId]);
    onComplete(miniWinId);
    
    // Reset animation after delay
    setTimeout(() => setAnimatingId(null), 1000);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category?: string) => {
    // Return empty string - no emojis
    return '';
  };

  // Only count miniWins completed TODAY (very accurate tracking)
  const today = new Date().toDateString();
  const completedCount = miniWins.filter(win => {
    // Check if completed in this session
    if (completedWins.includes(win.id)) return true;
    // Check if completed today (has timestamp from today)
    if (win.completed && win.completedAt) {
      const completedDate = new Date(win.completedAt).toDateString();
      return completedDate === today;
    }
    // If no timestamp but completed is true, don't count it
    return false;
  }).length;
  
  const totalPoints = miniWins.reduce((sum, win) => {
    // Check if completed in this session
    if (completedWins.includes(win.id)) return sum + win.points;
    // Check if completed today
    if (win.completed && win.completedAt) {
      const completedDate = new Date(win.completedAt).toDateString();
      return completedDate === today ? sum + win.points : sum;
    }
    return sum;
  }, 0);

  const getMotivationalMessage = (completed: number, total: number) => {
    const rate = total > 0 ? (completed / total) * 100 : 0;
    if (rate === 100) return "All mini wins completed! You're on fire!";
    if (rate >= 75) return "Almost there! Great momentum!";
    if (rate >= 50) return "Halfway through! Keep it up!";
    if (rate >= 25) return "Good start! Every win counts!";
    return "Quick wins build big momentum!";
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Mini Wins</h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedCount}/{miniWins.length}
          </span>
        </div>
        
        {/* Minimal Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#39d2c0] rounded-full transition-all duration-500"
            style={{ width: `${miniWins.length > 0 ? (completedCount / miniWins.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {miniWins.map((win) => {
          const today = new Date().toDateString();
          const wasCompletedToday = win.completed && win.completedAt 
            ? new Date(win.completedAt).toDateString() === today
            : false;
          const isCompleted = wasCompletedToday || completedWins.includes(win.id);
          const isAnimating = animatingId === win.id;
          
          return (
            <div 
              key={win.id} 
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-150 ${
                isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 hover:border-[#39d2c0]/50'
              } ${isAnimating ? 'animate-pulse' : ''}`}
            >
              {/* Minimal Checkbox */}
              <div 
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 mt-0.5 flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-[#39d2c0] border-[#39d2c0]' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-[#39d2c0]'
                }`}
                onClick={() => !isCompleted && handleComplete(win.id)}
              >
                {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
              </div>

              {/* Win Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed mb-2 ${
                  isCompleted 
                    ? 'text-gray-500 dark:text-gray-500 line-through' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {win.title}
                </p>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {win.time}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    +{win.points} pts
                  </span>
                  {win.difficulty && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      win.difficulty === 'easy' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                      win.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}>
                      {win.difficulty}
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              {!isCompleted && (
                <button
                  onClick={() => handleComplete(win.id)}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                >
                  Complete
                </button>
              )}

              {isCompleted && (
                <div className="flex items-center text-[#39d2c0] flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
