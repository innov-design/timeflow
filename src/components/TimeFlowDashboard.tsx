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

export const TimeFlowDashboard = () => {
  const [activities, setActivities] = useLocalStorage<Activity[]>('timeflow-activities', []);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'insights' | 'calculator'>('dashboard');
  const [streak, setStreak] = useLocalStorage<number>('timeflow-streak', 0);
  const [lastActiveDate, setLastActiveDate] = useLocalStorage<string>('timeflow-last-active', '');
  
  // New state for enhanced features
  const [calendarEvents, setCalendarEvents] = useLocalStorage<CalendarEvent[]>('timeflow-events', []);
  const [categoryGoals, setCategoryGoals] = useLocalStorage<CategoryGoal[]>('timeflow-goals', []);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('timeflow-todos', []);
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

  // Calculate insights data
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

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayActivities = activities.filter(activity => 
      new Date(activity.startTime).toDateString() === date.toDateString()
    );
    const totalTime = dayActivities.reduce((sum, activity) => sum + activity.duration, 0);
    
    return {
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      hours: Math.round(totalTime / 3600 * 10) / 10,
      activities: dayActivities.length
    };
  }).reverse();

  const productivityScore = Math.min(100, Math.round(
    (totalTimeToday / 3600) * 10 + 
    timerCount * 5 + 
    pomodoroCount * 10 + 
    focusModeCount * 15 + 
    streak * 2
  ));

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="w-full max-w-none mx-auto space-y-4">
        {/* Header */}
        <Card className="glass-effect p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">TimeFlow</h1>
              <p className="text-white/80">Your modern time management companion</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'secondary'}
                onClick={() => setCurrentView('dashboard')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Target className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={currentView === 'calendar' ? 'default' : 'secondary'}
                onClick={() => setCurrentView('calendar')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={currentView === 'calculator' ? 'default' : 'secondary'}
                onClick={() => setCurrentView('calculator')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculator
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              🔥 {streak} day streak
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              ⏱️ {Math.floor(totalTimeToday / 60)}h {totalTimeToday % 60}m today
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              📊 {activities.length} total activities
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              🎯 {completedGoals} goals completed
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              📈 {productivityScore}% productivity score
            </Badge>
          </div>
        </Card>

        {currentView === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Timers and Activities */}
              <div className="space-y-4">
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

              {/* Center Column - Goals and Todos */}
              <div className="space-y-4">
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
                <GamificationStats 
                  timerCount={timerCount}
                  pomodoroCount={pomodoroCount}
                  focusModeCount={focusModeCount}
                  goalsCompleted={completedGoals}
                  streak={streak}
                />
              </div>

              {/* Right Column - Stats and Focus */}
              <div className="space-y-4">
                <TodaysStats activities={activities} />
                <StreakCounter streak={streak} />
                <FocusMode onActivate={incrementFocusCount} />
              </div>
            </div>

            {/* Enhanced Data Visualization Section - Bottom */}
            <DataVisualization activities={activities} />

            {/* Original AI Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Category Breakdown Chart */}
              <Card className="glass-effect border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Category Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <ChartContainer config={{}} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: '#fff', fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="hours" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="text-white/60 text-center py-8">
                      No data available yet. Start tracking activities!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Weekly Progress */}
              <Card className="glass-effect border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <XAxis dataKey="day" tick={{ fill: '#fff', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="hours" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
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
