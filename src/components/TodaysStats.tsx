
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from './TimeFlowDashboard';

interface TodaysStatsProps {
  activities: Activity[];
}

export const TodaysStats: React.FC<TodaysStatsProps> = ({ activities }) => {
  const today = new Date().toDateString();
  const todaysActivities = activities.filter(activity => 
    new Date(activity.startTime).toDateString() === today
  );

  const totalTime = todaysActivities.reduce((total, activity) => total + activity.duration, 0);
  const totalHours = Math.floor(totalTime / 3600);
  const totalMinutes = Math.floor((totalTime % 3600) / 60);

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Today's Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-white">
          <div className="text-sm text-white/80">Total Time</div>
          <div className="text-lg font-semibold">{totalHours}h {totalMinutes}m</div>
        </div>
        <div className="text-white">
          <div className="text-sm text-white/80">Activities</div>
          <div className="text-lg font-semibold">{todaysActivities.length}</div>
        </div>
      </CardContent>
    </Card>
  );
};
