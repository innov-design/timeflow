
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

  // 1. Task Completion Rate (25 points)
  const completedTasks = todos.filter(todo => todo.completed).length;
  const totalTasks = todos.length;
  let taskScore = totalTasks > 0 ? (completedTasks / totalTasks) * 25 : 15;
  if (totalTasks > 0 && (completedTasks / totalTasks) > 0.9) taskScore += 2;

  // 2. Focus Time Quality (20 points)
  const targetDailyHours = 5; // 4-6 hours target
  const productiveCategories = ['Work', 'Education', 'Learning', 'Programming', 'Study', 'Technical'];
  const focusTime = todaysActivities
    .filter(activity => productiveCategories.some(cat => 
      activity.category.toLowerCase().includes(cat.toLowerCase())
    ))
    .reduce((sum, activity) => sum + activity.duration, 0) / 3600;
  
  const focusScore = Math.min(20, (focusTime / targetDailyHours) * 20);

  // 3. Pomodoro Effectiveness (15 points)
  const pomodoroScore = pomodoroCount > 0 ? 
    Math.min(15, (pomodoroCount / Math.max(pomodoroCount, 6)) * 15) : 10;

  // 4. Category Balance (10 points)
  const categoryDistribution = todaysActivities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + activity.duration;
    return acc;
  }, {} as Record<string, number>);

  const totalTime = Object.values(categoryDistribution).reduce((sum, time) => sum + (time as number), 0);
  const workTime = ((categoryDistribution['Work'] as number) || 0) + 
                   ((categoryDistribution['Education'] as number) || 0) + 
                   ((categoryDistribution['Learning'] as number) || 0);
  const leisureTime = (categoryDistribution['Leisure'] as number) || 0;
  const exerciseTime = ((categoryDistribution['Exercise'] as number) || 0) + 
                       ((categoryDistribution['Fitness'] as number) || 0);
  
  const workPercentage = totalTime > 0 ? (workTime / totalTime) * 100 : 0;
  const leisurePercentage = totalTime > 0 ? (leisureTime / totalTime) * 100 : 0;
  const exercisePercentage = totalTime > 0 ? (exerciseTime / totalTime) * 100 : 0;
  
  // Advanced balance scoring
  let balanceScore = 10;
  
  // Work/Education should be 40-50%
  if (workPercentage < 40) balanceScore -= Math.floor((40 - workPercentage) / 5);
  if (workPercentage > 50) balanceScore -= Math.floor((workPercentage - 50) / 5);
  
  // Leisure should be 15-25%
  if (leisurePercentage < 15) balanceScore -= Math.floor((15 - leisurePercentage) / 5);
  if (leisurePercentage > 25) balanceScore -= Math.floor((leisurePercentage - 25) / 5);
  
  // Exercise should be 8-12%
  if (exercisePercentage < 8) balanceScore -= Math.floor((8 - exercisePercentage) / 5);
  
  balanceScore = Math.max(0, balanceScore);

  // Base Score - Reset to 0 if onResetScore is called
  const baseScore = taskScore + focusScore + pomodoroScore + balanceScore;

  // Bonus Points (up to 30)
  let bonusPoints = 0;
  
  // Consistency bonuses (15 max)
  bonusPoints += Math.min(7, streak); // Daily streak
  const totalTodayHours = totalTodayTime / 3600;
  if (todaysActivities.length > 0 && totalTodayHours > 4) bonusPoints += 3; // Activity consistency
  if (totalTodayHours >= 6 && totalTodayHours <= 10) bonusPoints += 2; // Good daily routine
  
  // Wellness bonuses (10 max)
  const hasExercise = todaysActivities.some(activity => 
    activity.category.toLowerCase().includes('exercise') || 
    activity.category.toLowerCase().includes('fitness') ||
    activity.category.toLowerCase().includes('workout')
  );
  if (hasExercise) bonusPoints += 5;
  
  // Break discipline (inferred from activity gaps)
  const hasGoodBreaks = todaysActivities.length > 3; // Simple heuristic
  if (hasGoodBreaks) bonusPoints += 3;
  
  // Habit completion bonus (5 max)
  const completedHabits = habits.filter(habit => {
    const today = new Date().toDateString();
    return habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === today;
  }).length;
  bonusPoints += Math.min(5, completedHabits * 2);

  // Efficiency bonuses (5 max)
  bonusPoints += Math.min(3, focusModeCount); // Focus mode usage
  if (todaysActivities.length > 0) bonusPoints += 1; // Consistent logging

  // Penalties (max -15)
  let penalties = 0;
  if (leisurePercentage > 35) penalties += 5; // Excessive leisure
  if (!hasExercise && totalTodayHours > 6) penalties += 3; // No physical activity
  if (totalTodayHours < 4) penalties += 5; // Inconsistent logging

  // Final Score - Show 0 if reset is requested
  const finalScore = Math.min(100, Math.max(0, baseScore + bonusPoints - penalties));

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
          <div className="text-white/80 text-xs font-medium">Base Components (70 pts):</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/70">Tasks</span>
              <span className="text-white">{Math.round(taskScore)}/25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Focus</span>
              <span className="text-white">{Math.round(focusScore)}/20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Pomodoro</span>
              <span className="text-white">{Math.round(pomodoroScore)}/15</span>
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
            {hasExercise && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                💪 Exercise +5
              </Badge>
            )}
            {completedHabits > 0 && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                ✅ Habits +{Math.min(5, completedHabits * 2)}
              </Badge>
            )}
            {focusModeCount > 0 && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 text-xs">
                🎯 Focus +{Math.min(3, focusModeCount)}
              </Badge>
            )}
          </div>
        </div>

        {/* Distribution Breakdown */}
        <div className="space-y-1">
          <div className="text-white/80 text-xs font-medium">Today's Distribution:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-white font-medium">{Math.round(workPercentage)}%</div>
              <div className="text-white/60">Work</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">{Math.round(leisurePercentage)}%</div>
              <div className="text-white/60">Leisure</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">{Math.round(exercisePercentage)}%</div>
              <div className="text-white/60">Exercise</div>
            </div>
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
            <div className="text-white font-medium">{completedHabits}</div>
            <div className="text-white/60">Habits</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
