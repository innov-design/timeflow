import React, { useState, useEffect } from 'react';
import { ActiveTimer } from './ActiveTimer';
import { PomodoroTimer } from './PomodoroTimer';
import { TodaysStats } from './TodaysStats';
import { CustomTimer } from './CustomTimer';
import { FocusMode } from './FocusMode';
import { WeeklyGoal } from './WeeklyGoal';
import { ActivitiesLog } from './ActivitiesLog';
import { CalendarView } from './CalendarView';
import { AIInsights } from './AIInsights';
import { TimeCalculator } from './TimeCalculator';
import { StreakCounter } from './StreakCounter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Calculator, Target, TrendingUp, BarChart3, Clock, Activity } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { EnhancedCalendar } from './EnhancedCalendar';
import { CategoryGoals } from './CategoryGoals';
import { GamificationStats } from './GamificationStats';
import { TodoList } from './TodoList';
import { categorizeActivity, getCategoryColor, getCategoryEmoji } from '@/utils/aiCategorizer';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { DataVisualization } from './DataVisualization';
import { ProductivityScoreCard } from './ProductivityScoreCard';
import { HabitTracker } from './HabitTracker';

export interface Activity {
  id: string;
  name: string;
  description?: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  category: string;
  isActive?: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'event' | 'todo';
}

interface CategoryGoal {
  id: string;
  category: string;
  weeklyMinutes: number;
  currentMinutes: number;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category?: string;
}

interface Habit {
  id: string;
  name: string;
  target: number;
  unit: string;
  completed: boolean;
  streak: number;
  lastCompleted?: Date;
}

export const TimeFlowDashboard = () => {
  const [activities, setActivities] = useLocalStorage<Activity[]>('timeflow-activities', []);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'insights' | 'calculator'>('dashboard');
  const [streak, setStreak] = useLocalStorage<number>('timeflow-streak', 0);
  const [lastActiveDate, setLastActiveDate] = useLocalStorage<string>('timeflow-last-active', '');
  
  // New state for enhanced features
  const [calendarEvents, setCalendarEvents] = useLocalStorage<CalendarEvent[]>('timeflow-events', []);
  const [categoryGoals, setCategoryGoals] = useLocalStorage<CategoryGoal[]>('timeflow-goals', []);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('timeflow-todos', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('timeflow-habits', []);
  const [timerCount, setTimerCount] = useLocalStorage<number>('timeflow-timer-count', 0);
  const [pomodoroCount, setPomodoroCount] = useLocalStorage<number>('timeflow-pomodoro-count', 0);
  const [focusModeCount, setFocusModeCount] = useLocalStorage<number>('timeflow-focus-count', 0);

  useEffect(() => {
    const today = new Date().toDateString();
    if (lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActiveDate === yesterday.toDateString()) {
        setStreak(prev => prev + 1);
      } else if (lastActiveDate !== '') {
        setStreak(0);
      }
      setLastActiveDate(today);
    }
  }, [lastActiveDate, setStreak, setLastActiveDate]);

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
    };
    setActivities(prev => [...prev, newActivity]);
    setTimerCount(prev => prev + 1);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, ...updates } : activity
    ));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(event => event.id !== id));
  };

  const addCategoryGoal = (goal: Omit<CategoryGoal, 'id' | 'currentMinutes'>) => {
    const newGoal: CategoryGoal = {
      ...goal,
      id: Date.now().toString(),
      currentMinutes: 0,
    };
    setCategoryGoals(prev => [...prev, newGoal]);
  };

  const updateCategoryGoal = (id: string, updates: Partial<CategoryGoal>) => {
    setCategoryGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const addTodo = (todo: Omit<TodoItem, 'id'>) => {
    const newTodo: TodoItem = {
      ...todo,
      id: Date.now().toString(),
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const addHabit = (habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const today = new Date().toDateString();
        const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
        
        if (lastCompleted === today) {
          return { ...habit, completed: false, lastCompleted: undefined };
        } else {
          const newStreak = lastCompleted === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString() 
            ? habit.streak + 1 
            : 1;
          return { 
            ...habit, 
            completed: true, 
            lastCompleted: new Date(),
            streak: newStreak
          };
        }
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const resetProductivityScore = () => {
    // Reset relevant counters that affect productivity score
    setPomodoroCount(0);
    setFocusModeCount(0);
    setTimerCount(0);
    // Note: We don't reset streak as it's a longer-term metric
  };

  const incrementPomodoroCount = () => {
    setPomodoroCount(prev => prev + 1);
  };

  const incrementFocusCount = () => {
    setFocusModeCount(prev => prev + 1);
  };

  const totalTimeToday = activities
    .filter(activity => {
      const activityDate = new Date(activity.startTime).toDateString();
      const today = new Date().toDateString();
      return activityDate === today;
    })
    .reduce((total, activity) => total + activity.duration, 0);

  const completedGoals = categoryGoals.filter(goal => 
    goal.currentMinutes >= Math.floor(goal.weeklyMinutes / 60)
  ).length;

  // Calculate insights data for charts
  const categoryData = activities.reduce((acc, activity) => {
    const categories = categorizeActivity(activity.name);
    categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = { name: category, value: 0, activities: 0 };
      }
      acc[category].value += activity.duration;
      acc[category].activities += 1;
    });
    return acc;
  }, {} as Record<string, { name: string; value: number; activities: number }>);

  const chartData = Object.values(categoryData).map(item => ({
    ...item,
    hours: Math.round(item.value / 3600 * 10) / 10
  }));

  return (
    <div className="min-h-screen gradient-bg p-2">
      <div className="w-full max-w-none mx-auto space-y-2">
        {/* Header */}
        <Card className="glass-effect p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">TimeFlow</h1>
              <p className="text-white/80 text-sm">Your modern time management companion</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'secondary'}
                onClick={() => setCurrentView('dashboard')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                size="sm"
              >
                <Target className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
              <Button
                variant={currentView === 'calendar' ? 'default' : 'secondary'}
                onClick={() => setCurrentView('calendar')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Calendar
              </Button>
              <Button
                variant={currentView === 'calculator' ? 'default' : 'secondary'}
                onClick={() => setCurrentView('calculator')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                size="sm"
              >
                <Calculator className="w-4 h-4 mr-1" />
                Calculator
              </Button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              🔥 {streak} day streak
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              ⏱️ {Math.floor(totalTimeToday / 60)}h {totalTimeToday % 60}m today
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              📊 {activities.length} total activities
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              🎯 {completedGoals} goals completed
            </Badge>
          </div>
        </Card>

        {currentView === 'dashboard' && (
          <>
            {/* Main Dashboard Grid - No gaps, full width utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2 h-[calc(100vh-200px)]">
              {/* Column 1 - Timers */}
              <div className="space-y-2 h-full overflow-y-auto">
                <ActiveTimer 
                  activities={activities}
                  onAddActivity={addActivity}
                  onUpdateActivity={updateActivity}
                />
                <ActivitiesLog 
                  activities={activities}
                  onDeleteActivity={deleteActivity}
                />
                <PomodoroTimer onComplete={incrementPomodoroCount} />
                <CustomTimer />
              </div>

              {/* Column 2 - Goals and Stats */}
              <div className="space-y-2 h-full overflow-y-auto">
                <ProductivityScoreCard 
                  activities={activities}
                  todos={todos}
                  habits={habits}
                  pomodoroCount={pomodoroCount}
                  focusModeCount={focusModeCount}
                  streak={streak}
                  onResetScore={resetProductivityScore}
                />
                <TodaysStats activities={activities} />
                <CategoryGoals 
                  activities={activities}
                  goals={categoryGoals}
                  onAddGoal={addCategoryGoal}
                  onUpdateGoal={updateCategoryGoal}
                />
                <TodoList 
                  todos={todos}
                  onAddTodo={addTodo}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                />
              </div>

              {/* Column 3 - Habits and Focus */}
              <div className="space-y-2 h-full overflow-y-auto">
                <HabitTracker 
                  habits={habits}
                  onAddHabit={addHabit}
                  onToggleHabit={toggleHabit}
                  onDeleteHabit={deleteHabit}
                />
                <StreakCounter streak={streak} />
                <FocusMode onActivate={incrementFocusCount} />
                
                {/* Category Breakdown Chart - Compact */}
                <Card className="glass-effect border-white/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center gap-2 text-sm">
                      <BarChart3 className="w-4 h-4" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {chartData.length > 0 ? (
                      <ChartContainer config={{}} className="h-[150px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <XAxis 
                              dataKey="name" 
                              tick={{ fill: '#fff', fontSize: 8 }}
                              angle={-45}
                              textAnchor="end"
                              height={40}
                            />
                            <YAxis tick={{ fill: '#fff', fontSize: 8 }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="hours" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    ) : (
                      <div className="text-white/60 text-center py-4 text-xs">
                        Start tracking activities!
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Column 4 - Gamification */}
              <div className="space-y-2 h-full overflow-y-auto">
                <GamificationStats 
                  timerCount={timerCount}
                  pomodoroCount={pomodoroCount}
                  focusModeCount={focusModeCount}
                  goalsCompleted={completedGoals}
                  streak={streak}
                  productivityScore={0}
                  totalTimeToday={totalTimeToday}
                  activities={activities}
                />
              </div>
            </div>

            {/* Data Visualization - Bottom section, full width */}
            <DataVisualization activities={activities} />
          </>
        )}

        {currentView === 'calendar' && (
          <EnhancedCalendar 
            activities={activities}
            events={calendarEvents}
            onAddEvent={addCalendarEvent}
            onDeleteEvent={deleteCalendarEvent}
          />
        )}

        {currentView === 'calculator' && (
          <TimeCalculator />
        )}
      </div>
    </div>
  );
};
