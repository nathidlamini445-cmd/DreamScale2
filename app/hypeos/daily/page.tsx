'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HorizontalNav } from '@/components/horizontal-nav';
import DailyFocusCard from '@/components/hypeos/daily-focus-card';
import MiniWins from '@/components/hypeos/mini-wins';
import MoreTasksModal from '@/components/hypeos/more-tasks-modal';
import { useSessionSafe } from '@/lib/session-context';
import { 
  Target, 
  Zap, 
  Calendar,
  Clock,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

// Mock data
const mockTasks = [
  { 
    id: 1, 
    title: "Post 3 TikToks", 
    completed: false, 
    points: 150, 
    impact: "medium" as const,
    category: "content",
    estimatedTime: "30 min"
  },
  { 
    id: 2, 
    title: "Email 5 potential clients", 
    completed: false, 
    points: 300, 
    impact: "high" as const,
    category: "sales",
    estimatedTime: "45 min"
  },
  { 
    id: 3, 
    title: "Update pricing page", 
    completed: false, 
    points: 200, 
    impact: "medium" as const,
    category: "admin",
    estimatedTime: "20 min"
  },
  { 
    id: 4, 
    title: "Research competitor pricing", 
    completed: false, 
    points: 100, 
    impact: "low" as const,
    category: "research",
    estimatedTime: "15 min"
  }
];

const mockMiniWins = [
  { 
    id: 1, 
    title: "Check analytics", 
    completed: false, 
    points: 25, 
    time: "2 min",
    category: "admin",
    difficulty: "easy" as const
  },
  { 
    id: 2, 
    title: "Reply to comments", 
    completed: false, 
    points: 30, 
    time: "3 min",
    category: "social",
    difficulty: "easy" as const
  },
  { 
    id: 3, 
    title: "Update bio", 
    completed: false, 
    points: 20, 
    time: "1 min",
    category: "admin",
    difficulty: "easy" as const
  }
];

export default function DailyFocusPage() {
  const router = useRouter();
  const { sessionData } = useSessionSafe();
  
  // Start with mock data to prevent hydration mismatch
  // Load from localStorage in useEffect (client-side only)
  const [tasks, setTasks] = useState(mockTasks);
  const [miniWins, setMiniWins] = useState(mockMiniWins);
  const [userPoints, setUserPoints] = useState(2450);
  const [currentStreak, setCurrentStreak] = useState(12);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const [showMoreTasksModal, setShowMoreTasksModal] = useState(false);

  // Load from localStorage on client-side only (prevents hydration mismatch)
  useEffect(() => {
    try {
      const today = new Date().toDateString();
      let loadedAnyData = false;
      
      // One-time cleanup: Clear any old completed tasks without timestamps
      // This ensures we start fresh with accurate tracking
      const cleanupOldData = () => {
        const savedTasks = localStorage.getItem('hypeos:daily:tasks');
        const savedTasksDate = localStorage.getItem('hypeos:daily:tasksLastDate');
        if (savedTasks && savedTasksDate === today) {
          try {
            const parsed = JSON.parse(savedTasks);
            if (Array.isArray(parsed)) {
              const cleanedTasks = parsed.map((task: any) => {
                // If task is completed but has no timestamp, reset it
                if (task.completed && !task.completedAt) {
                  return { ...task, completed: false, completedAt: undefined };
                }
                // If task has timestamp but it's not today, reset it
                if (task.completed && task.completedAt) {
                  const completedDate = new Date(task.completedAt).toDateString();
                  if (completedDate !== today) {
                    return { ...task, completed: false, completedAt: undefined };
                  }
                }
                return task;
              });
              // Save cleaned tasks back
              localStorage.setItem('hypeos:daily:tasks', JSON.stringify(cleanedTasks));
              console.log('🧹 Cleaned up old completed tasks without timestamps');
            }
          } catch (e) {
            console.warn('Failed to cleanup tasks', e);
          }
        }
        
        // Same for miniWins
        const savedMiniWins = localStorage.getItem('hypeos:daily:miniWins');
        const savedMiniWinsDate = localStorage.getItem('hypeos:daily:miniWinsLastDate');
        if (savedMiniWins && savedMiniWinsDate === today) {
          try {
            const parsed = JSON.parse(savedMiniWins);
            if (Array.isArray(parsed)) {
              const cleanedMiniWins = parsed.map((win: any) => {
                if (win.completed && !win.completedAt) {
                  return { ...win, completed: false, completedAt: undefined };
                }
                if (win.completed && win.completedAt) {
                  const completedDate = new Date(win.completedAt).toDateString();
                  if (completedDate !== today) {
                    return { ...win, completed: false, completedAt: undefined };
                  }
                }
                return win;
              });
              localStorage.setItem('hypeos:daily:miniWins', JSON.stringify(cleanedMiniWins));
              console.log('🧹 Cleaned up old completed miniWins without timestamps');
            }
          } catch (e) {
            console.warn('Failed to cleanup miniWins', e);
          }
        }
      };
      
      // Run cleanup first
      cleanupOldData();
      
      // Load tasks
      const savedTasks = localStorage.getItem('hypeos:daily:tasks');
      const savedTasksDate = localStorage.getItem('hypeos:daily:tasksLastDate');
      if (savedTasks && savedTasksDate === today) {
        try {
          const parsed = JSON.parse(savedTasks);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const isValid = parsed.every((task: any) => 
              task && typeof task.id === 'number' && typeof task.title === 'string'
            );
            if (isValid) {
              // Reset tasks completed on previous days (only count today's completions)
              const resetTasks = parsed.map((task: any) => {
                if (task.completed && task.completedAt) {
                  const completedDate = new Date(task.completedAt).toDateString();
                  // If task was completed on a different day, reset it
                  if (completedDate !== today) {
                    return { ...task, completed: false, completedAt: undefined };
                  }
                } else if (task.completed && !task.completedAt) {
                  // If task is marked completed but has no timestamp, reset it (old data)
                  return { ...task, completed: false, completedAt: undefined };
                }
                return task;
              });
              setTasks(resetTasks);
              loadedAnyData = true;
              console.log('✅ Loaded daily tasks from localStorage:', resetTasks.length, 'tasks (reset old completions)');
            } else {
              console.warn('⚠️ Invalid task structure in localStorage');
              localStorage.removeItem('hypeos:daily:tasks');
              localStorage.removeItem('hypeos:daily:tasksLastDate');
            }
          }
        } catch (parseError) {
          console.error('❌ Failed to parse tasks from localStorage:', parseError);
          localStorage.removeItem('hypeos:daily:tasks');
          localStorage.removeItem('hypeos:daily:tasksLastDate');
        }
      } else if (savedTasks && savedTasksDate !== today) {
        // Tasks from previous day - reset all completions
        try {
          const parsed = JSON.parse(savedTasks);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const resetTasks = parsed.map((task: any) => ({
              ...task,
              completed: false,
              completedAt: undefined
            }));
            setTasks(resetTasks);
            // Update the date
            localStorage.setItem('hypeos:daily:tasksLastDate', today);
            localStorage.setItem('hypeos:daily:tasks', JSON.stringify(resetTasks));
            console.log('✅ Reset tasks from previous day - all completions cleared');
          }
        } catch (e) {
          console.warn('Failed to reset tasks from previous day', e);
        }
      }
      
      // Load miniWins
      const savedMiniWins = localStorage.getItem('hypeos:daily:miniWins');
      const savedMiniWinsDate = localStorage.getItem('hypeos:daily:miniWinsLastDate');
      if (savedMiniWins && savedMiniWinsDate === today) {
        try {
          const parsed = JSON.parse(savedMiniWins);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Reset miniWins completed on previous days
            const resetMiniWins = parsed.map((win: any) => {
              if (win.completed && win.completedAt) {
                const completedDate = new Date(win.completedAt).toDateString();
                if (completedDate !== today) {
                  return { ...win, completed: false, completedAt: undefined };
                }
              } else if (win.completed && !win.completedAt) {
                // Old data without timestamp - reset it
                return { ...win, completed: false, completedAt: undefined };
              }
              return win;
            });
            setMiniWins(resetMiniWins);
            loadedAnyData = true;
            console.log('✅ Loaded daily miniWins from localStorage:', resetMiniWins.length, '(reset old completions)');
          }
        } catch (e) {
          console.warn('Failed to load daily miniWins from localStorage', e);
        }
      } else if (savedMiniWins && savedMiniWinsDate !== today) {
        // MiniWins from previous day - reset all completions
        try {
          const parsed = JSON.parse(savedMiniWins);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const resetMiniWins = parsed.map((win: any) => ({
              ...win,
              completed: false,
              completedAt: undefined
            }));
            setMiniWins(resetMiniWins);
            localStorage.setItem('hypeos:daily:miniWinsLastDate', today);
            localStorage.setItem('hypeos:daily:miniWins', JSON.stringify(resetMiniWins));
            console.log('✅ Reset miniWins from previous day - all completions cleared');
          }
        } catch (e) {
          console.warn('Failed to reset miniWins from previous day', e);
        }
      }
      
      // Load userPoints
      const savedPoints = localStorage.getItem('hypeos:daily:userPoints');
      if (savedPoints) {
        const points = parseInt(savedPoints, 10);
        if (!isNaN(points)) {
          setUserPoints(points);
          loadedAnyData = true;
          console.log('✅ Loaded user points from localStorage:', points);
        }
      }
      
      // Load streak
      const savedStreak = localStorage.getItem('hypeos:daily:currentStreak');
      if (savedStreak) {
        const streak = parseInt(savedStreak, 10);
        if (!isNaN(streak)) {
          setCurrentStreak(streak);
          loadedAnyData = true;
          console.log('✅ Loaded streak from localStorage:', streak);
        }
      }
      
      // Mark as loaded (even if no data was found, to prevent overwriting)
      setHasLoadedFromStorage(true);
    } catch (e) {
      console.error('❌ Failed to load from localStorage:', e);
      setHasLoadedFromStorage(true); // Still mark as loaded to prevent infinite loop
    }
  }, []); // Only run once on mount

  // Save tasks to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    // Don't save until we've loaded from localStorage (prevents overwriting saved data with mock data)
    if (!hasLoadedFromStorage) return;
    
    try {
      if (typeof window !== 'undefined' && tasks.length > 0) {
        const today = new Date().toDateString();
        const tasksJson = JSON.stringify(tasks);
        localStorage.setItem('hypeos:daily:tasks', tasksJson);
        localStorage.setItem('hypeos:daily:tasksLastDate', today);
        console.log('💾 Saved daily tasks to localStorage:', tasks.length, 'tasks', {
          completed: tasks.filter(t => t.completed).length
        });
      }
    } catch (e: any) {
      // Handle quota exceeded error
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.error('❌ localStorage quota exceeded! Clearing old data...');
        // Try to clear old data and retry
        try {
          // Clear tasks from previous days
          const today = new Date().toDateString();
          const savedDate = localStorage.getItem('hypeos:daily:tasksLastDate');
          if (savedDate && savedDate !== today) {
            localStorage.removeItem('hypeos:daily:tasks');
            localStorage.removeItem('hypeos:daily:tasksLastDate');
            // Retry saving
            localStorage.setItem('hypeos:daily:tasks', JSON.stringify(tasks));
            localStorage.setItem('hypeos:daily:tasksLastDate', today);
            console.log('✅ Retried save after clearing old data');
          }
        } catch (retryError) {
          console.error('❌ Still failed after clearing old data:', retryError);
        }
      } else {
        console.warn('Failed to save daily tasks to localStorage', e);
      }
    }
  }, [tasks, hasLoadedFromStorage]);

  // Save miniWins to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    // Don't save until we've loaded from localStorage
    if (!hasLoadedFromStorage) return;
    
    try {
      if (typeof window !== 'undefined' && miniWins.length > 0) {
        const today = new Date().toDateString();
        localStorage.setItem('hypeos:daily:miniWins', JSON.stringify(miniWins));
        localStorage.setItem('hypeos:daily:miniWinsLastDate', today);
        console.log('💾 Saved daily miniWins to localStorage:', miniWins.length);
      }
    } catch (e) {
      console.warn('Failed to save daily miniWins to localStorage', e);
    }
  }, [miniWins, hasLoadedFromStorage]);

  // Save userPoints to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    // Don't save until we've loaded from localStorage
    if (!hasLoadedFromStorage) return;
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hypeos:daily:userPoints', userPoints.toString());
        console.log('💾 Saved user points to localStorage:', userPoints);
      }
    } catch (e) {
      console.warn('Failed to save user points to localStorage', e);
    }
  }, [userPoints, hasLoadedFromStorage]);

  // Save streak to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    // Don't save until we've loaded from localStorage
    if (!hasLoadedFromStorage) return;
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hypeos:daily:currentStreak', currentStreak.toString());
        console.log('💾 Saved streak to localStorage:', currentStreak);
      }
    } catch (e) {
      console.warn('Failed to save streak to localStorage', e);
    }
  }, [currentStreak, hasLoadedFromStorage]);

  const completeTask = (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        console.warn('Task not found:', taskId);
        return;
      }

      // Set completion timestamp for accurate daily quest tracking
      const todayISO = new Date().toISOString();
      const updatedTasks = tasks.map(t => 
        t.id === taskId 
          ? { ...t, completed: true, completedAt: todayISO }
          : t
      );
      setTasks(updatedTasks);
      
      // Immediately save to localStorage (like Bizora)
      try {
        if (typeof window !== 'undefined') {
          const today = new Date().toDateString();
          const tasksJson = JSON.stringify(updatedTasks);
          localStorage.setItem('hypeos:daily:tasks', tasksJson);
          localStorage.setItem('hypeos:daily:tasksLastDate', today);
          console.log('💾 Immediately saved completed task to localStorage');
        }
      } catch (e: any) {
        // Handle quota exceeded error
        if (e.name === 'QuotaExceededError' || e.code === 22) {
          console.error('❌ localStorage quota exceeded when saving task!');
          // The useEffect will handle retry with clearing old data
        } else {
          console.error('❌ Failed to immediately save task to localStorage:', e);
        }
      }
      
      // Update points
      const newPoints = userPoints + task.points;
      setUserPoints(newPoints);
      
      // Immediately save points
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hypeos:daily:userPoints', newPoints.toString());
        }
      } catch (e: any) {
        console.error('❌ Failed to save points to localStorage:', e);
      }
    } catch (error) {
      console.error('❌ Error completing task:', error);
      // Don't throw - just log the error
    }
  };

  const completeMiniWin = (miniWinId: number) => {
    // Set completion timestamp for accurate daily tracking
    const todayISO = new Date().toISOString();
    const updatedMiniWins = miniWins.map(win => 
      win.id === miniWinId 
        ? { ...win, completed: true, completedAt: todayISO }
        : win
    );
    setMiniWins(updatedMiniWins);
    
    // Immediately save to localStorage (like Bizora)
    try {
      if (typeof window !== 'undefined') {
        const today = new Date().toDateString();
        localStorage.setItem('hypeos:daily:miniWins', JSON.stringify(updatedMiniWins));
        localStorage.setItem('hypeos:daily:miniWinsLastDate', today);
        console.log('💾 Immediately saved completed miniWin to localStorage');
      }
    } catch (e) {
      console.warn('Failed to immediately save miniWin to localStorage', e);
    }
    
    const miniWin = miniWins.find(w => w.id === miniWinId);
    if (miniWin) {
      const newPoints = userPoints + miniWin.points;
      setUserPoints(newPoints);
      
      // Immediately save points
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hypeos:daily:userPoints', newPoints.toString());
        }
      } catch (e) {
        console.warn('Failed to save points to localStorage', e);
      }
    }
  };

  const skipTask = (taskId: number) => {
    // Handle task skip logic
    console.log('Task skipped:', taskId);
  };

  const handleAddMoreTasks = (newTasks: any[]) => {
    // Get the highest existing task ID
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
    
    // Add new tasks with unique IDs
    const tasksToAdd = newTasks.map((task, index) => ({
      ...task,
      id: maxId + index + 1,
      completed: false,
      completedAt: undefined
    }));
    
    const updatedTasks = [...tasks, ...tasksToAdd];
    setTasks(updatedTasks);
    
    // Save immediately
    try {
      if (typeof window !== 'undefined') {
        const today = new Date().toDateString();
        localStorage.setItem('hypeos:daily:tasks', JSON.stringify(updatedTasks));
        localStorage.setItem('hypeos:daily:tasksLastDate', today);
        console.log('💾 Added new tasks to localStorage');
      }
    } catch (e) {
      console.warn('Failed to save new tasks to localStorage', e);
    }
  };

  // Get user goal data from session
  const userGoal = sessionData?.hypeos?.user?.goalTitle || '';
  const userCategory = sessionData?.hypeos?.user?.category || 'general';
  const userTarget = sessionData?.hypeos?.user?.goalTarget || '';
  const userCurrent = sessionData?.hypeos?.user?.goalCurrent || '';

  // Only count tasks completed TODAY (very accurate tracking)
  const today = new Date().toDateString();
  const completedTasksToday = tasks.filter(task => {
    if (!task.completed) return false;
    // If task has completedAt timestamp, check if it's today
    if (task.completedAt) {
      const completedDate = new Date(task.completedAt).toDateString();
      return completedDate === today;
    }
    // If no timestamp but completed is true, don't count it (prevents false positives)
    return false;
  }).length;
  
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasksToday / totalTasks) * 100 : 0;

  // Only count miniWins completed TODAY
  const completedMiniWinsToday = miniWins.filter(win => {
    if (!win.completed) return false;
    // If miniWin has completedAt timestamp, check if it's today
    if (win.completedAt) {
      const completedDate = new Date(win.completedAt).toDateString();
      return completedDate === today;
    }
    // If no timestamp but completed is true, don't count it
    return false;
  }).length;
  const totalMiniWins = miniWins.length;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <HorizontalNav />
      <div className="max-w-7xl mx-auto px-8 py-16 pt-28">
        {/* Header - Ultra Minimal */}
        <div className="mb-16">
          <button 
            onClick={() => router.push('/hypeos')}
            className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
          <h1 className="text-5xl font-normal text-gray-900 dark:text-white mb-2 tracking-tight">
            Daily Focus
          </h1>
          <div className="flex items-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-500">
            <span>{completedTasksToday} of {totalTasks} tasks completed</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">{Math.round(completionRate)}%</span>
          </div>
        </div>

        {/* Main Content - Notion Style */}
        <div className="space-y-16">
          {/* Daily Focus Tasks */}
          <div>
            <DailyFocusCard
              tasks={tasks}
              onTaskComplete={completeTask}
              onTaskSkip={skipTask}
              streak={currentStreak}
              momentumMultiplier={currentStreak >= 3 ? 1.5 : 1.0}
              onMoreTasksClick={() => setShowMoreTasksModal(true)}
            />
          </div>

          {/* Mini Wins */}
          <div>
            <MiniWins
              miniWins={miniWins}
              onComplete={completeMiniWin}
              streak={currentStreak}
            />
          </div>
        </div>

        {/* Motivational Section - Ultra Minimal */}
        {completionRate < 100 && (
          <div className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-900">
            <p className="text-gray-600 dark:text-gray-500 mb-8 text-base">
              {completionRate >= 75 
                ? "You're doing amazing! Just a few more tasks to go."
                : completionRate >= 50 
                ? "You're making solid progress. Keep the momentum going!"
                : "Every task you complete brings you closer to your goals."
              }
            </p>
            <button 
              className="text-sm text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              onClick={() => {
                // Find the first incomplete task
                const nextTask = tasks.find(task => {
                  // Check if task is not completed (considering today's completion)
                  const today = new Date().toDateString();
                  if (task.completed && task.completedAt) {
                    const completedDate = new Date(task.completedAt).toDateString();
                    return completedDate !== today;
                  }
                  return !task.completed;
                });
                
                if (nextTask) {
                  const taskElement = document.getElementById(`task-${nextTask.id}`);
                  if (taskElement) {
                    // Scroll to the task with some offset from top
                    taskElement.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'center'
                    });
                    // Add a subtle highlight effect
                    taskElement.classList.add('ring-2', 'ring-[#39d2c0]', 'ring-opacity-50');
                    setTimeout(() => {
                      taskElement.classList.remove('ring-2', 'ring-[#39d2c0]', 'ring-opacity-50');
                    }, 2000);
                  }
                } else {
                  // If no incomplete tasks, scroll to the first task or show message
                  const firstTask = tasks[0];
                  if (firstTask) {
                    const taskElement = document.getElementById(`task-${firstTask.id}`);
                    if (taskElement) {
                      taskElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }
                  }
                }
              }}
            >
              Focus on next task →
            </button>
          </div>
        )}

        {/* More Tasks Modal */}
        <MoreTasksModal
          isOpen={showMoreTasksModal}
          onClose={() => setShowMoreTasksModal(false)}
          onAddTasks={handleAddMoreTasks}
          userGoal={userGoal}
          userCategory={userCategory}
          userTarget={userTarget}
          userCurrent={userCurrent}
          existingTasks={tasks}
        />
      </div>
    </div>
  );
}
