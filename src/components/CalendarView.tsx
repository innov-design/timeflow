
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Activity } from './TimeFlowDashboard';
import { getCategoryColor, getCategoryEmoji } from '@/utils/aiCategorizer';

interface CalendarViewProps {
  activities: Activity[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ activities }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getActivitiesForDate = (date: Date) => {
    const dateString = date.toDateString();
    return activities.filter(activity => 
      new Date(activity.startTime).toDateString() === dateString
    );
  };

  const getTotalTimeForDate = (date: Date) => {
    const dayActivities = getActivitiesForDate(date);
    return dayActivities.reduce((total, activity) => total + activity.duration, 0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendar View
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white font-semibold min-w-48 text-center">
              {monthName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="text-white hover:bg-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-white/80 font-medium p-2 text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-16"></div>;
            }
            
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayActivities = getActivitiesForDate(date);
            const totalTime = getTotalTimeForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={day}
                className={`h-16 p-1 rounded-lg border border-white/10 bg-white/5 ${
                  isToday ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="text-white text-sm font-medium mb-1">{day}</div>
                {totalTime > 0 && (
                  <div className="text-xs text-white/80">
                    {formatTime(totalTime)}
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-1">
                  {dayActivities.slice(0, 2).map((activity, idx) => (
                    <div
                      key={idx}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getCategoryColor(activity.category) }}
                      title={activity.name}
                    />
                  ))}
                  {dayActivities.length > 2 && (
                    <div className="text-xs text-white/60">
                      +{dayActivities.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-2">
          <h4 className="text-white font-medium">Categories</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Array.from(new Set(activities.map(a => a.category))).map(category => (
              <div key={category} className="flex items-center gap-2 text-white/80">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getCategoryColor(category) }}
                />
                <span className="text-xs">{getCategoryEmoji(category)} {category}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
