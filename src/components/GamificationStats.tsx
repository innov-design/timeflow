
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Timer, Target, Zap } from 'lucide-react';

interface GamificationStatsProps {
  timerCount: number;
  pomodoroCount: number;
  focusModeCount: number;
  goalsCompleted: number;
  streak: number;
}

export const GamificationStats: React.FC<GamificationStatsProps> = ({
  timerCount,
  pomodoroCount,
  focusModeCount,
  goalsCompleted,
  streak
}) => {
  const stats = [
    {
      label: 'Timers Set',
      value: timerCount,
      icon: Timer,
      color: 'bg-blue-500',
      achievement: timerCount >= 10 ? '🎯 Timer Master' : null
    },
    {
      label: 'Pomodoros',
      value: pomodoroCount,
      icon: Target,
      color: 'bg-red-500',
      achievement: pomodoroCount >= 5 ? '🍅 Pomodoro Pro' : null
    },
    {
      label: 'Focus Sessions',
      value: focusModeCount,
      icon: Zap,
      color: 'bg-yellow-500',
      achievement: focusModeCount >= 3 ? '⚡ Focus Champion' : null
    },
    {
      label: 'Goals Completed',
      value: goalsCompleted,
      icon: Trophy,
      color: 'bg-green-500',
      achievement: goalsCompleted >= 1 ? '🏆 Goal Achiever' : null
    }
  ];

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Display */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-4 border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">{streak}</div>
              <div className="text-white/80 text-sm">Day Streak</div>
            </div>
            <div className="text-3xl">🔥</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/10 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${stat.color}`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white/80 text-xs">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              {stat.achievement && (
                <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                  {stat.achievement}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Achievement Hints */}
        <div className="space-y-2">
          <h4 className="text-white/80 text-sm font-medium">Next Achievements:</h4>
          <div className="space-y-1 text-xs text-white/60">
            {timerCount < 10 && <div>🎯 Set {10 - timerCount} more timers to become a Timer Master</div>}
            {pomodoroCount < 5 && <div>🍅 Complete {5 - pomodoroCount} more pomodoros to become a Pomodoro Pro</div>}
            {focusModeCount < 3 && <div>⚡ Use focus mode {3 - focusModeCount} more times to become a Focus Champion</div>}
            {goalsCompleted < 1 && <div>🏆 Complete 1 goal to become a Goal Achiever</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
