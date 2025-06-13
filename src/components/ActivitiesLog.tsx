
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Activity } from './TimeFlowDashboard';
import { getCategoryColor, getCategoryEmoji } from '@/utils/aiCategorizer';

interface ActivitiesLogProps {
  activities: Activity[];
  onDeleteActivity: (id: string) => void;
}

export const ActivitiesLog: React.FC<ActivitiesLogProps> = ({ 
  activities, 
  onDeleteActivity 
}) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const today = new Date().toDateString();
  const todaysActivities = activities
    .filter(activity => new Date(activity.startTime).toDateString() === today)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Activities Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {todaysActivities.length === 0 ? (
          <div className="text-white/60 text-center py-8">
            No activities logged today
          </div>
        ) : (
          todaysActivities.map((activity) => (
            <div 
              key={activity.id}
              className="bg-white/10 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {getCategoryEmoji(activity.category)}
                    </span>
                    <h4 className="text-white font-medium truncate">
                      {activity.name}
                    </h4>
                    {activity.isActive && (
                      <Badge className="bg-green-500 text-white animate-pulse-slow">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-white/80 text-sm">
                    {formatTime(activity.startTime)} • {formatDuration(activity.duration)}
                  </p>
                  {activity.description && (
                    <p className="text-white/60 text-sm mt-1 line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteActivity(activity.id)}
                  className="text-white/60 hover:text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{ 
                  backgroundColor: getCategoryColor(activity.category) + '20',
                  color: getCategoryColor(activity.category),
                  border: `1px solid ${getCategoryColor(activity.category)}40`
                }}
              >
                {activity.category}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
