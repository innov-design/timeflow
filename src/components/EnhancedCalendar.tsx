
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Plus, X } from 'lucide-react';
import { Activity } from './TimeFlowDashboard';
import { getCategoryColor, getCategoryEmoji } from '@/utils/aiCategorizer';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'event' | 'todo';
}

interface EnhancedCalendarProps {
  activities: Activity[];
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

export const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({ 
  activities, 
  events, 
  onAddEvent, 
  onDeleteEvent 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventType, setNewEventType] = useState<'event' | 'todo'>('event');

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

  const getEventsForDate = (date: Date) => {
    const dateString = date.toDateString();
    return events.filter(event => 
      new Date(event.date).toDateString() === dateString
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

  const handleAddEvent = () => {
    if (!newEventTitle.trim() || !selectedDate) return;
    
    onAddEvent({
      title: newEventTitle,
      description: newEventDescription,
      date: selectedDate.toISOString(),
      type: newEventType
    });
    
    setNewEventTitle('');
    setNewEventDescription('');
    setShowAddForm(false);
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
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
                  return <div key={index} className="h-20"></div>;
                }
                
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayActivities = getActivitiesForDate(date);
                const dayEvents = getEventsForDate(date);
                const totalTime = getTotalTimeForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                
                return (
                  <div
                    key={day}
                    className={`h-20 p-1 rounded-lg border cursor-pointer transition-colors ${
                      isToday 
                        ? 'border-primary bg-primary/20' 
                        : isSelected 
                        ? 'border-white/40 bg-white/10' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-white text-sm font-medium mb-1">{day}</div>
                    {totalTime > 0 && (
                      <div className="text-xs text-white/80">
                        {formatTime(totalTime)}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayActivities.slice(0, 1).map((activity, idx) => (
                        <div
                          key={idx}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(activity.category) }}
                          title={activity.name}
                        />
                      ))}
                      {dayEvents.slice(0, 1).map((event, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${event.type === 'todo' ? 'bg-yellow-400' : 'bg-blue-400'}`}
                          title={event.title}
                        />
                      ))}
                      {(dayActivities.length + dayEvents.length) > 2 && (
                        <div className="text-xs text-white/60">
                          +{(dayActivities.length + dayEvents.length) - 2}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Day Details */}
      <div className="space-y-4">
        {selectedDate && (
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                {selectedDate.toLocaleDateString('default', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
              <Button
                onClick={() => setShowAddForm(true)}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {/* Activities for selected day */}
              {getActivitiesForDate(selectedDate).map((activity) => (
                <div key={activity.id} className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getCategoryEmoji(activity.category)}</span>
                    <span className="text-white font-medium">{activity.name}</span>
                  </div>
                  <div className="text-white/80 text-sm">
                    {formatTime(activity.duration)}
                  </div>
                </div>
              ))}

              {/* Events for selected day */}
              {getEventsForDate(selectedDate).map((event) => (
                <div key={event.id} className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span>{event.type === 'todo' ? '✅' : '📅'}</span>
                        <span className="text-white font-medium">{event.title}</span>
                      </div>
                      {event.description && (
                        <div className="text-white/80 text-sm">{event.description}</div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteEvent(event.id)}
                      className="text-white/60 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {getActivitiesForDate(selectedDate).length === 0 && getEventsForDate(selectedDate).length === 0 && (
                <div className="text-white/60 text-center py-4">
                  No activities or events for this day
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add Event Form */}
        {showAddForm && selectedDate && (
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Add New Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={newEventType === 'event' ? 'default' : 'outline'}
                  onClick={() => setNewEventType('event')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  📅 Event
                </Button>
                <Button
                  size="sm"
                  variant={newEventType === 'todo' ? 'default' : 'outline'}
                  onClick={() => setNewEventType('todo')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  ✅ Todo
                </Button>
              </div>
              <Input
                placeholder="Title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
              />
              <Textarea
                placeholder="Description (optional)"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddEvent}
                  disabled={!newEventTitle.trim()}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Add {newEventType}
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewEventTitle('');
                    setNewEventDescription('');
                  }}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
