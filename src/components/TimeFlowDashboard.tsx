
import React, { useState, useEffect } from 'react';
import { ActiveTimer } from './ActiveTimer';
import { PomodoroTimer } from './PomodoroTimer';
import { TodaysStats } from './TodaysStats';
import { QuickTimer } from './QuickTimer';
import { FocusMode } from './FocusMode';
import { WeeklyGoal } from './WeeklyGoal';
import { ActivitiesLog } from './ActivitiesLog';
import { CalendarView } from './CalendarView';
import { AIInsights } from './AIInsights';
import { TimeCalculator } from './TimeCalculator';
import { StreakCounter } from './StreakCounter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, BarChart3, Brain, Calculator, Target } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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

export const TimeFlowDashboard = () => {
  const [activities, setActivities] = useLocalStorage<Activity[]>('timeflow-activities', []);
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'insights' | 'calculator'>('dashboard');
  const [streak, setStreak] = useLocalStorage<number>('timeflow-streak', 0);
  const [lastActiveDate, setLastActiveDate] = useLocalStorage<string>('timeflow-last-active', '');

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
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, ...updates } : activity
    ));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const totalTimeToday = activities
    .filter(activity => {
      const activityDate = new Date(activity.startTime).toDateString();
      const today = new Date().toDateString();
      return activityDate === today;
    })
    .reduce((total, activity) => total + activity.duration, 0);

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-7xl mx-auto space-y-6">
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
                variant={currentView === 'insights' ? 'default' : 'secondary'}
                onClick={() => setCurrentView('insights')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Insights
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
          </div>
        </Card>

        {currentView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <ActiveTimer 
                activities={activities}
                onAddActivity={addActivity}
                onUpdateActivity={updateActivity}
              />
              <ActivitiesLog 
                activities={activities}
                onDeleteActivity={deleteActivity}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <StreakCounter streak={streak} />
              <PomodoroTimer />
              <TodaysStats activities={activities} />
              <QuickTimer />
              <FocusMode />
              <WeeklyGoal activities={activities} />
            </div>
          </div>
        )}

        {currentView === 'calendar' && (
          <CalendarView activities={activities} />
        )}

        {currentView === 'insights' && (
          <AIInsights activities={activities} />
        )}

        {currentView === 'calculator' && (
          <TimeCalculator />
        )}
      </div>
    </div>
  );
};
