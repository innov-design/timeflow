
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Clock, CheckCircle } from 'lucide-react';

interface ProductivityScoreCardProps {
  activities: any[];
  todos: any[];
  habits: any[];
  pomodoroCount: number;
  focusModeCount: number;
  streak: number;
}

export const ProductivityScoreCard: React.FC<ProductivityScoreCardProps> = ({
  activities,
  todos,
  habits,
  pomodoroCount,
  focusModeCount,
  streak
}) => {
  // Calculate today's activities
  const today = new Date().toDateString();
  const todaysActivities = activities.filter(activity => 
    new Date(activity.startTime).toDateString() === today
  );

  const totalTodayTime = todaysActivities.reduce((sum, activity) => sum + activity.duration, 0);
  const totalTodayHours = totalTodayTime / 3600;

  // 1. Task Completion Rate (25 points)
  const completedTasks = todos.filter(todo => todo.completed).length;
  const totalTasks = todos.length;
  let taskScore = totalTasks > 0 ? (completedTasks / totalTasks) * 25 : 15;
  if (totalTasks > 0 && (completedTasks / totalTasks) > 0.9) taskScore += 2;

  // 2. Focus Time Quality (20 points)
  const targetDailyHours = 5; // 4-6 hours target
  const productiveCategories = ['Work', 'Education', 'Learning', 'Programming', 'Study'];
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

  const totalTime = Object.values(categoryDistribution).reduce((sum, time) => sum + time, 0);
  const workPercentage = ((categoryDistribution['Work'] || 0) / totalTime) * 100;
  const leisurePercentage = ((categoryDistribution['Leisure'] || 0) / totalTime) * 100;
  
  // Simplified balance scoring
  let balanceScore = 10;
  if (workPercentage > 60 || workPercentage < 30) balanceScore -= 3;
  if (leisurePercentage > 30 || leisurePercentage < 10) balanceScore -= 2;

  // Base Score
  const baseScore = taskScore + focusScore + pomodoroScore + balanceScore;

  // Bonus Points
  let bonusPoints = 0;
  
  // Consistency bonuses
  bonusPoints += Math.min(7, streak); // Daily streak
  if (todaysActivities.length > 0 && totalTodayHours > 2) bonusPoints += 3; // Activity consistency
  
  // Wellness bonuses
  const hasExercise = todaysActivities.some(activity => 
    activity.category.toLowerCase().includes('exercise') || 
    activity.category.toLowerCase().includes('fitness')
  );
  if (hasExercise) bonusPoints += 5;
  
  // Habit completion bonus
  const completedHabits = habits.filter(habit => habit.completed).length;
  bonusPoints += Math.min(5, completedHabits * 2);

  // Focus mode bonus
  bonusPoints += Math.min(3, focusModeCount);

  // Final Score
  const finalScore = Math.min(100, Math.max(0, baseScore + bonusPoints));

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
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4" />
          Productivity Score
        </CardTitle>
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
          <div className="text-white/80 text-xs font-medium">Base Components:</div>
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
          <div className="text-white/80 text-xs font-medium">Bonuses: +{bonusPoints}</div>
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
