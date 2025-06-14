
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, Target, Clock, CheckCircle, RotateCcw } from 'lucide-react';

interface ProductivityScoreCardProps {
  activities: any[];
  todos: any[];
  habits: any[];
  pomodoroCount: number;
  focusModeCount: number;
  streak: number;
  onResetScore?: () => void;
}

// AI-driven productivity scoring for activities
const getActivityProductivityScore = (activityName: string): number => {
  const activity = activityName.toLowerCase();
  
  // High productivity (0.8-1.0)
  if (activity.includes('codecademy') || activity.includes('coding') || 
      activity.includes('programming') || activity.includes('study') || 
      activity.includes('learn') || activity.includes('course') ||
      activity.includes('work') || activity.includes('meeting') ||
      activity.includes('training') || activity.includes('skill') ||
      activity.includes('book') || activity.includes('research') ||
      activity.includes('homework') || activity.includes('exam') ||
      activity.includes('practice') || activity.includes('tutorial') ||
      activity.includes('project') || activity.includes('lecture')) {
    return 0.9;
  }
  
  // Medium-high productivity (0.6-0.8)
  if (activity.includes('exercise') || activity.includes('workout') || 
      activity.includes('gym') || activity.includes('run') || 
      activity.includes('yoga') || activity.includes('fitness') ||
      activity.includes('planning') || activity.includes('organize') ||
      activity.includes('email') || activity.includes('communication') ||
      activity.includes('cooking') || activity.includes('clean')) {
    return 0.7;
  }
  
  // Medium productivity (0.4-0.6)
  if (activity.includes('travel') || activity.includes('shopping') || 
      activity.includes('errands') || activity.includes('maintenance') ||
      activity.includes('admin') || activity.includes('calls') ||
      activity.includes('walk') || activity.includes('commute') ||
      activity.includes('family time') || activity.includes('social')) {
    return 0.5;
  }
  
  // Low-medium productivity (0.2-0.4)
  if (activity.includes('tv') || activity.includes('movie') || 
      activity.includes('music') || activity.includes('game') ||
      activity.includes('leisure') || activity.includes('break') ||
      activity.includes('entertainment') || activity.includes('browsing')) {
    return 0.3;
  }
  
  // Low productivity (0.0-0.2)
  if (activity.includes('doomscroll') || activity.includes('social media') || 
      activity.includes('scrolling') || activity.includes('procrastinating') ||
      activity.includes('idle') || activity.includes('wasting time')) {
    return 0.1;
  }
  
  // Default medium-low for unknown activities
  return 0.4;
};

export const ProductivityScoreCard: React.FC<ProductivityScoreCardProps> = ({
  activities,
  todos,
  habits,
  pomodoroCount,
  focusModeCount,
  streak,
  onResetScore
}) => {
  // Calculate today's activities
  const today = new Date().toDateString();
  const todaysActivities = activities.filter(activity => 
    new Date(activity.startTime).toDateString() === today
  );

  const totalTodayTime = todaysActivities.reduce((sum, activity) => sum + activity.duration, 0);

  // 1. Task Completion Rate (25 points) - Reset to 0
  const completedTasks = 0; // Reset to 0
  const totalTasks = todos.length;
  let taskScore = 0; // Reset to 0

  // 2. AI-Weighted Activity Productivity (30 points) - Reset to 0
  const weightedProductivityScore = 0; // Reset to 0
  const totalActivityTime = todaysActivities.reduce((sum, activity) => sum + activity.duration, 0);
  const averageProductivity = 0; // Reset to 0
  const aiProductivityScore = 0; // Reset to 0

  // 3. Focus Time Quality (15 points) - Reset to 0
  const targetDailyHours = 5;
  const productiveCategories = ['Work', 'Education', 'Learning', 'Programming', 'Study', 'Technical'];
  const focusTime = 0; // Reset to 0
  const focusScore = 0; // Reset to 0

  // 4. Category Balance (10 points)
  const categoryDistribution = todaysActivities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + activity.duration;
    return acc;
  }, {} as Record<string, number>);

  const totalTime = Object.values(categoryDistribution).reduce((sum: number, time) => sum + (time as number), 0);
  const workTime = (categoryDistribution['Work'] || 0) + 
                   (categoryDistribution['Education'] || 0) + 
                   (categoryDistribution['Learning'] || 0);
  const leisureTime = categoryDistribution['Leisure'] || 0;
  const exerciseTime = (categoryDistribution['Exercise'] || 0) + 
                       (categoryDistribution['Fitness'] || 0);
  
  const workPercentage = totalTime > 0 ? (workTime / totalTime) * 100 : 0;
  const leisurePercentage = totalTime > 0 ? (leisureTime / totalTime) * 100 : 0;
  const exercisePercentage = totalTime > 0 ? (exerciseTime / totalTime) * 100 : 0;
  
  let balanceScore = 10;
  
  if (workPercentage < 40) balanceScore -= Math.floor((40 - workPercentage) / 5);
  if (workPercentage > 50) balanceScore -= Math.floor((workPercentage - 50) / 5);
  if (leisurePercentage < 15) balanceScore -= Math.floor((15 - leisurePercentage) / 5);
  if (leisurePercentage > 25) balanceScore -= Math.floor((leisurePercentage - 25) / 5);
  if (exercisePercentage < 8) balanceScore -= Math.floor((8 - exercisePercentage) / 5);
  
  balanceScore = Math.max(0, balanceScore);

  // Base Score (80 points total) - All reset to 0
  const baseScore = 0; // Reset to 0

  // Bonus Points (up to 20) - Reset to 0
  let bonusPoints = 0; // Reset to 0

  // Penalties - Reset to 0
  let penalties = 0; // Reset to 0

  // Final Score - Reset to 0
  const finalScore = 0; // Reset to 0

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Highly Productive';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    if (score >= 50) return 'Below Average';
    return 'Needs Improvement';
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            Productivity Score
          </CardTitle>
          {onResetScore && (
            <Button
              size="sm"
              variant="outline"
              onClick={onResetScore}
              className="border-white/30 text-white hover:bg-white/10 bg-transparent h-6 w-6 p-0"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Main Score Display */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(finalScore)}`}>
            {Math.round(finalScore)}%
          </div>
          <div className="text-white/80 text-xs">{getScoreLabel(finalScore)}</div>
          <Progress value={finalScore} className="mt-2 h-2" />
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2">
          <div className="text-white/80 text-xs font-medium">Components (80 pts):</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/70">Tasks</span>
              <span className="text-white">{Math.round(taskScore)}/25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">AI Score</span>
              <span className="text-white">{Math.round(aiProductivityScore)}/30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Focus</span>
              <span className="text-white">{Math.round(focusScore)}/15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Balance</span>
              <span className="text-white">{Math.round(balanceScore)}/10</span>
            </div>
          </div>
        </div>

        {/* Bonus Points */}
        <div className="space-y-1">
          <div className="text-white/80 text-xs font-medium">
            Bonuses: +{bonusPoints} | Penalties: -{penalties}
          </div>
          <div className="flex flex-wrap gap-1">
            {streak > 0 && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                🔥 Streak +{Math.min(7, streak)}
              </Badge>
            )}
          </div>
        </div>

        {/* AI Productivity Insight */}
        <div className="bg-white/5 rounded p-2">
          <div className="text-white/80 text-xs font-medium mb-1">AI Activity Analysis:</div>
          <div className="text-white text-xs">
            Avg. Productivity: {Math.round(averageProductivity * 100)}%
          </div>
          <div className="text-white/60 text-xs">
            Focus on more productive activities
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-white font-medium">{Math.round(focusTime * 10) / 10}h</div>
            <div className="text-white/60">Focus Time</div>
          </div>
          <div className="text-center">
            <div className="text-white font-medium">{completedTasks}/{totalTasks}</div>
            <div className="text-white/60">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-white font-medium">0</div>
            <div className="text-white/60">Habits</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
