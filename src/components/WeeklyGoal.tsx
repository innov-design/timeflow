
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import { Activity } from './TimeFlowDashboard';

interface WeeklyGoalProps {
  activities: Activity[];
}

export const WeeklyGoal: React.FC<WeeklyGoalProps> = ({ activities }) => {
  const weeklyGoal = 40 * 60 * 60; // 40 hours in seconds
  
  // Calculate this week's total
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const thisWeeksActivities = activities.filter(activity => 
    new Date(activity.startTime) >= startOfWeek
  );
  
  const weeklyTotal = thisWeeksActivities.reduce((total, activity) => total + activity.duration, 0);
  const progress = Math.min((weeklyTotal / weeklyGoal) * 100, 100);
  
  const hoursCompleted = Math.floor(weeklyTotal / 3600);
  const goalHours = Math.floor(weeklyGoal / 3600);

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Weekly Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-white text-center">
          <div className="text-2xl font-bold">{hoursCompleted}h / {goalHours}h</div>
          <div className="text-sm text-white/80">This week's progress</div>
        </div>
        <Progress value={progress} className="h-2" />
        <Button 
          size="sm" 
          variant="outline"
          className="w-full border-white/30 text-white hover:bg-white/10"
        >
          Set Goal
        </Button>
      </CardContent>
    </Card>
  );
};
