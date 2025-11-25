'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { HorizontalNav } from '@/components/horizontal-nav';
import { useSessionSafe } from '@/lib/session-context';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar,
  Zap,
  Flame,
  Star,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  impact: 'high' | 'medium' | 'low';
  category?: string;
  completedAt?: string;
}

interface User {
  hypePoints: number;
  currentStreak: number;
  longestStreak: number;
  goalProgress: number;
  goalTitle?: string;
}

export default function ProgressPage() {
  const sessionContext = useSessionSafe();
  const sessionData = sessionContext?.sessionData || null;
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState({
    totalPoints: 0,
    weeklyPoints: [0, 0, 0, 0, 0, 0, 0],
    monthlyProgress: 0,
    streakData: {
      current: 0,
      longest: 0,
      average: 0
    },
    taskCompletion: {
      high: 0,
      medium: 0,
      low: 0
    },
    categoryBreakdown: [] as Array<{ category: string; points: number; percentage: number }>,
    weeklyInsights: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load real data from localStorage
  useEffect(() => {
    try {
      // Load user data
      const stored = localStorage.getItem('dreamscale_session');
      let userData: User | null = null;
      
      if (stored) {
        const parsed = JSON.parse(stored);
        const sessionUser = parsed?.hypeos?.user;
        const goalsList = parsed?.hypeos?.allGoals || [];
        const userToLoad = sessionUser || (goalsList.length > 0 ? goalsList[0] : null);
        
        if (userToLoad) {
          userData = {
            hypePoints: userToLoad.hypePoints || 0,
            currentStreak: userToLoad.currentStreak || 0,
            longestStreak: userToLoad.longestStreak || 0,
            goalProgress: userToLoad.goalProgress || 0,
            goalTitle: userToLoad.goalTitle
          };
        }
      }
      
      // Also try direct localStorage
      const savedUser = localStorage.getItem('hypeos:user');
      if (savedUser && !userData) {
        const parsed = JSON.parse(savedUser);
        userData = {
          hypePoints: parsed.hypePoints || 0,
          currentStreak: parsed.currentStreak || 0,
          longestStreak: parsed.longestStreak || 0,
          goalProgress: parsed.goalProgress || 0,
          goalTitle: parsed.goalTitle
        };
      }
      
      setUser(userData);
      
      // Load tasks from both locations
      const savedTasks = localStorage.getItem('hypeos:tasks');
      const savedDailyTasks = localStorage.getItem('hypeos:daily:tasks');
      let allTasks: Task[] = [];
      
      if (savedTasks) {
        try {
          const parsed = JSON.parse(savedTasks);
          if (Array.isArray(parsed)) {
            allTasks = [...allTasks, ...parsed];
          }
        } catch (e) {
          console.warn('Failed to parse hypeos:tasks', e);
        }
      }
      
      if (savedDailyTasks) {
        try {
          const parsed = JSON.parse(savedDailyTasks);
          if (Array.isArray(parsed)) {
            allTasks = [...allTasks, ...parsed];
          }
        } catch (e) {
          console.warn('Failed to parse hypeos:daily:tasks', e);
        }
      }
      
      setTasks(allTasks);
      
      // Calculate real analytics
      calculateRealAnalytics(userData, allTasks);
      setIsLoading(false);
    } catch (e) {
      console.error('Failed to load progress data', e);
      setIsLoading(false);
    }
  }, []);

  const calculateRealAnalytics = (userData: User | null, allTasks: Task[]) => {
    if (!userData) {
      setAnalytics({
        totalPoints: 0,
        weeklyPoints: [0, 0, 0, 0, 0, 0, 0],
        monthlyProgress: 0,
        streakData: { current: 0, longest: 0, average: 0 },
        taskCompletion: { high: 0, medium: 0, low: 0 },
        categoryBreakdown: [],
        weeklyInsights: []
      });
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // Calculate weekly points (last 7 days)
    const weeklyPoints = [0, 0, 0, 0, 0, 0, 0];
    const completedTasks = allTasks.filter(t => t.completed && t.completedAt);
    
    completedTasks.forEach(task => {
      if (task.completedAt) {
        const completedDate = new Date(task.completedAt);
        const daysAgo = Math.floor((today.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo >= 0 && daysAgo < 7) {
          const dayIndex = 6 - daysAgo; // 0 = today, 6 = 6 days ago
          if (dayIndex >= 0 && dayIndex < 7) {
            weeklyPoints[dayIndex] += task.points || 0;
          }
        }
      }
    });

    // Calculate task completion rates by impact
    const highImpactTasks = allTasks.filter(t => t.impact === 'high');
    const mediumImpactTasks = allTasks.filter(t => t.impact === 'medium');
    const lowImpactTasks = allTasks.filter(t => t.impact === 'low');
    
    const highCompleted = highImpactTasks.filter(t => t.completed && t.completedAt).length;
    const mediumCompleted = mediumImpactTasks.filter(t => t.completed && t.completedAt).length;
    const lowCompleted = lowImpactTasks.filter(t => t.completed && t.completedAt).length;
    
    const taskCompletion = {
      high: highImpactTasks.length > 0 ? Math.round((highCompleted / highImpactTasks.length) * 100) : 0,
      medium: mediumImpactTasks.length > 0 ? Math.round((mediumCompleted / mediumImpactTasks.length) * 100) : 0,
      low: lowImpactTasks.length > 0 ? Math.round((lowCompleted / lowImpactTasks.length) * 100) : 0
    };

    // Calculate category breakdown
    const categoryMap = new Map<string, number>();
    completedTasks.forEach(task => {
      const category = task.category || 'General';
      const points = task.points || 0;
      categoryMap.set(category, (categoryMap.get(category) || 0) + points);
    });
    
    const totalCategoryPoints = Array.from(categoryMap.values()).reduce((sum, p) => sum + p, 0);
    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, points]) => ({
      category,
      points,
      percentage: totalCategoryPoints > 0 ? Math.round((points / totalCategoryPoints) * 100) : 0
    })).sort((a, b) => b.points - a.points);

    // Generate insights based on real data
    const insights: string[] = [];
    const totalCompleted = completedTasks.length;
    const totalTasks = allTasks.length;
    
    if (totalCompleted > 0) {
      const completionRate = Math.round((totalCompleted / totalTasks) * 100);
      if (completionRate >= 80) {
        insights.push("You're maintaining an excellent completion rate!");
      } else if (completionRate >= 60) {
        insights.push("You're making steady progress on your tasks.");
      }
      
      if (userData.currentStreak >= 7) {
        insights.push(`You've maintained a ${userData.currentStreak}-day streak!`);
      }
      
      if (weeklyPoints[0] > 0) {
        insights.push("You've been active today - keep it up!");
      }
    } else {
      insights.push("Start completing tasks to see your progress here.");
    }

    setAnalytics({
      totalPoints: userData.hypePoints,
      weeklyPoints,
      monthlyProgress: userData.goalProgress || 0,
      streakData: {
        current: userData.currentStreak,
        longest: userData.longestStreak,
        average: userData.currentStreak // Simplified for now
      },
      taskCompletion,
      categoryBreakdown,
      weeklyInsights: insights.length > 0 ? insights : ["Complete tasks to see insights here."]
    });
  };

  const getMotivationalMessage = (progress: number) => {
    if (progress >= 90) return "You're absolutely crushing it!";
    if (progress >= 80) return "Incredible momentum! Keep going!";
    if (progress >= 70) return "You're on fire!";
    if (progress >= 60) return "Great progress! You've got this!";
    if (progress >= 50) return "Halfway there! Keep pushing!";
    return "Building momentum! Every step counts!";
  };

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: "Legendary", color: "text-purple-600", icon: "" };
    if (streak >= 21) return { level: "Expert", color: "text-orange-600", icon: "" };
    if (streak >= 14) return { level: "Advanced", color: "text-green-600", icon: "" };
    if (streak >= 7) return { level: "Intermediate", color: "text-blue-600", icon: "" };
    if (streak >= 3) return { level: "Beginner", color: "text-gray-600", icon: "" };
    return { level: "Starting", color: "text-gray-500", icon: "" };
  };

  const streakLevel = getStreakLevel(analytics.streakData.current);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 dark:border-gray-700 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <HorizontalNav />
      <div className="max-w-7xl mx-auto px-8 py-16 pt-28">
        {/* Header - Ultra Minimal */}
        <div className="mb-16">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
          <h1 className="text-5xl font-normal text-gray-900 dark:text-white mb-2 tracking-tight">
            Progress
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <button className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Export
            </button>
            <button className="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Share
            </button>
          </div>
        </div>

        {/* Period Selector - Ultra Minimal */}
        <div className="flex gap-1 mb-16 pb-8 border-b border-gray-100 dark:border-gray-900">
          {['week', 'month', 'quarter', 'year'].map((period) => {
            const isSelected = selectedPeriod === period;
            return (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  isSelected
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Key Metrics - Ultra Minimal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div>
            <div className="text-3xl font-normal text-gray-900 dark:text-white mb-1">
              {analytics.totalPoints.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              Total points
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              +12% from last month
            </div>
          </div>

          <div>
            <div className="text-3xl font-normal text-gray-900 dark:text-white mb-1">
              {analytics.streakData.current}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              Current streak
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              {streakLevel.level}
            </div>
          </div>

          <div>
            <div className="text-3xl font-normal text-gray-900 dark:text-white mb-1">
              {analytics.monthlyProgress}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              Goal progress
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              On track
            </div>
          </div>

          <div>
            <div className="text-3xl font-normal text-gray-900 dark:text-white mb-1">
              +2.3x
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              Growth velocity
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Faster than last month
            </div>
          </div>
        </div>

        <div className="space-y-16 mb-16">
          {/* Weekly Points Chart */}
          <div>
            <h2 className="text-lg font-normal text-gray-900 dark:text-white mb-8">Weekly points</h2>
            <div className="space-y-4">
              {analytics.weeklyPoints.map((points, index) => {
                const maxPoints = Math.max(...analytics.weeklyPoints, 1); // Avoid division by zero
                const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
                // Calculate actual day names based on current date (most recent = today)
                const today = new Date();
                const dayIndex = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
                const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                // Reverse order: index 0 = today, index 6 = 6 days ago
                const actualDayIndex = (dayIndex - (6 - index) + 7) % 7;
                const dayName = dayNames[actualDayIndex];
                
                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-500">{dayName}</span>
                      <span className="text-gray-900 dark:text-white">{points} pts</span>
                    </div>
                    <Progress value={percentage} className="h-1" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Completion by Impact */}
          <div>
            <h2 className="text-lg font-normal text-gray-900 dark:text-white mb-8">Task completion rate</h2>
            <div className="space-y-4">
              {Object.entries(analytics.taskCompletion).map(([impact, rate]) => (
                <div key={impact} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-500 capitalize">{impact} impact</span>
                    <span className="text-gray-900 dark:text-white">{rate}%</span>
                  </div>
                  <Progress value={rate} className="h-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mb-16">
          <h2 className="text-lg font-normal text-gray-900 dark:text-white mb-8">Points by category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {analytics.categoryBreakdown.map((category, index) => (
              <div key={index}>
                <div className="text-2xl font-normal text-gray-900 dark:text-white mb-1">
                  {category.points}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">
                  {category.category}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-600">
                  {category.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="mb-16">
          <h2 className="text-lg font-normal text-gray-900 dark:text-white mb-8">Insights</h2>
          <div className="space-y-3">
            {analytics.weeklyInsights.map((insight, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-500">
                {insight}
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="pt-12 border-t border-gray-100 dark:border-gray-900">
          <p className="text-base text-gray-600 dark:text-gray-500 mb-4">
            {getMotivationalMessage(analytics.monthlyProgress)}
          </p>
          <div className="flex gap-4 text-sm">
            <button 
              className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              onClick={() => window.location.href = '/hypeos/daily'}
            >
              Continue today's tasks →
            </button>
            <button 
              className="text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              onClick={() => window.location.href = '/hypeos/rewards'}
            >
              View rewards →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
