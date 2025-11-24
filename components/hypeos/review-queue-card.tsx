'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  type DailyReviewQueue,
  type ReviewQueueItem,
  getReviewQueueSummary,
  getReviewQueueMotivation,
  needsReviewAttention,
  getReviewQueueStats
} from '@/lib/hypeos/review-queue';
import { SkillStrengthBadge } from './skill-strength-indicator';

interface ReviewQueueCardProps {
  queue: DailyReviewQueue;
  onTaskClick?: (taskId: number) => void;
  onStartReview?: () => void;
}

export default function ReviewQueueCard({
  queue,
  onTaskClick,
  onStartReview
}: ReviewQueueCardProps) {
  const summary = getReviewQueueSummary(queue);
  const motivation = getReviewQueueMotivation(queue);
  const stats = getReviewQueueStats(queue);
  const needsAttention = needsReviewAttention(queue);
  
  const getReviewTypeIcon = (type: ReviewQueueItem['reviewType']) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'weakened':
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      case 'new':
        return <Sparkles className="h-4 w-4 text-blue-500" />;
      case 'practice':
        return <RefreshCw className="h-4 w-4 text-green-500" />;
      case 'mastery':
        return <CheckCircle2 className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  const getReviewTypeColor = (type: ReviewQueueItem['reviewType']) => {
    switch (type) {
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800';
      case 'weakened':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200 border-orange-200 dark:border-orange-800';
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800';
      case 'practice':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'mastery':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
    }
  };
  
  const getReviewTypeLabel = (type: ReviewQueueItem['reviewType']) => {
    switch (type) {
      case 'overdue':
        return 'Overdue';
      case 'weakened':
        return 'Weakened';
      case 'new':
        return 'New';
      case 'practice':
        return 'Practice';
      case 'mastery':
        return 'Mastery';
    }
  };

  if (queue.totalItems === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
          <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
            All Caught Up!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All your skills are up to date.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Review Queue</h2>
          <span className={`text-xs px-2 py-1 rounded ${
            needsAttention 
              ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
          }`}>
            {queue.totalItems} {queue.totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>
        
        {/* Summary */}
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {motivation}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>
              {queue.overdueCount > 0 && `${queue.overdueCount} overdue`}
              {queue.overdueCount > 0 && queue.weakenedCount > 0 && ' • '}
              {queue.weakenedCount > 0 && `${queue.weakenedCount} weakened`}
              {queue.newCount > 0 && ` • ${queue.newCount} new`}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              ~{Math.round(queue.estimatedTime / 60 * 10) / 10} min
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {/* Review Items */}
        {queue.items.slice(0, 5).map((item, index) => (
          <div
            key={item.task.id}
            className={`p-3 rounded-lg border transition-all duration-150 cursor-pointer hover:border-[#39d2c0] ${
              item.reviewType === 'overdue'
                ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                : item.reviewType === 'weakened'
                ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800'
                : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800'
            }`}
            onClick={() => onTaskClick?.(item.task.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getReviewTypeIcon(item.reviewType)}
                  <span className={`text-xs px-2 py-0.5 rounded ${getReviewTypeColor(item.reviewType)}`}>
                    {getReviewTypeLabel(item.reviewType)}
                  </span>
                  {item.priority >= 80 && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                      Urgent
                    </span>
                  )}
                </div>
                
                <p className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                  {item.task.title}
                </p>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {item.reason}
                </p>
                
                {/* Skill Strength Badge */}
                {item.difficulty.skillStrength && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <SkillStrengthBadge
                      strength={item.difficulty.skillStrength.strength}
                      level={item.difficulty.skillStrength.level}
                      daysUntilDecay={item.difficulty.skillStrength.daysUntilDecay}
                      isOverdue={item.difficulty.skillStrength.isOverdue}
                    />
                    {item.strengthLoss && item.strengthLoss > 0 && (
                      <span className="text-xs text-orange-600 dark:text-orange-400">
                        -{item.strengthLoss}% strength
                      </span>
                    )}
                  </div>
                )}
                
                {/* Priority Indicator */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Priority</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {item.priority}/100
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#39d2c0] rounded-full transition-all duration-300"
                      style={{ width: `${item.priority}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Show More Button */}
      {queue.items.length > 5 && (
        <div className="text-center pt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +{queue.items.length - 5} more items in queue
          </p>
        </div>
      )}
      
      {/* Start Review Button */}
      {queue.totalItems > 0 && (
        <button
          onClick={onStartReview}
          className="w-full mt-6 px-4 py-2 bg-[#39d2c0] hover:bg-[#39d2c0]/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Start Review Session
        </button>
      )}
      
      {/* Stats Footer */}
      <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.byType.overdue || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overdue</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.byType.weakened || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Weakened</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.byType.new || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">New</div>
          </div>
        </div>
      </div>
    </div>
  );
}

