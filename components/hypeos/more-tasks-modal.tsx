'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Plus, Clock, CheckCircle } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  impact: 'high' | 'medium' | 'low';
  category?: string;
  estimatedTime?: string;
  howToComplete?: string[];
  completedAt?: string;
}

interface MoreTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (tasks: Task[]) => void;
  userGoal?: string;
  userCategory?: string;
  userTarget?: string;
  userCurrent?: string;
  existingTasks?: Task[];
}

export default function MoreTasksModal({
  isOpen,
  onClose,
  onAddTasks,
  userGoal = '',
  userCategory = 'general',
  userTarget = '',
  userCurrent = '',
  existingTasks = []
}: MoreTasksModalProps) {
  const [generatedTasks, setGeneratedTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && generatedTasks.length === 0) {
      generateTasks();
    }
  }, [isOpen]);

  const generateTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/hypeos/generate-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalTitle: userGoal,
          category: userCategory,
          goalTarget: userTarget,
          goalCurrent: userCurrent,
          existingTasks: existingTasks.map(t => t.title)
        }),
      });

      const data = await response.json();
      
      if (data.success && data.tasks) {
        setGeneratedTasks(data.tasks);
      } else {
        setError('Failed to generate tasks. Please try again.');
      }
    } catch (err) {
      console.error('Error generating tasks:', err);
      setError('Failed to generate tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskSelection = (taskId: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleAddSelected = () => {
    const tasksToAdd = generatedTasks.filter(task => selectedTasks.has(task.id));
    if (tasksToAdd.length > 0) {
      onAddTasks(tasksToAdd);
      setSelectedTasks(new Set());
      onClose();
    }
  };

  const handleAddAll = () => {
    onAddTasks(generatedTasks);
    setSelectedTasks(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">
              More Tasks
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tailored to your goal: {userGoal || 'your goal'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#39d2c0] animate-spin mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generating personalized tasks for you...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={generateTasks}
                className="text-sm text-[#39d2c0] hover:text-[#2bb3a3] transition-colors"
              >
                Try again
              </button>
            </div>
          ) : generatedTasks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No tasks generated yet.
              </p>
              <button
                onClick={generateTasks}
                className="text-sm text-[#39d2c0] hover:text-[#2bb3a3] transition-colors"
              >
                Generate tasks
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {generatedTasks.map((task) => {
                const isSelected = selectedTasks.has(task.id);
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#39d2c0] bg-[#39d2c0]/5 dark:bg-[#39d2c0]/10'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                    onClick={() => toggleTaskSelection(task.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#39d2c0] border-[#39d2c0]'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          {task.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            task.impact === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                            task.impact === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                            'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          }`}>
                            {task.impact}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            +{task.points} pts
                          </span>
                          {task.estimatedTime && (
                            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.estimatedTime}
                            </span>
                          )}
                        </div>

                        {/* How to Complete */}
                        {task.howToComplete && task.howToComplete.length > 0 && (
                          <div className="mt-2 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                              {task.howToComplete.slice(0, 3).map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-[#39d2c0] mt-0.5 flex-shrink-0">•</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && !error && generatedTasks.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedTasks.size > 0 ? (
                <span>{selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected</span>
              ) : (
                <span>Select tasks to add to your daily list</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Add All
              </button>
              <button
                onClick={handleAddSelected}
                disabled={selectedTasks.size === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-[#39d2c0] rounded-md hover:bg-[#2bb3a3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Selected ({selectedTasks.size})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

