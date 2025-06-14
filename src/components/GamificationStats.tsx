
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Timer, Target, Zap, Download, FileText } from 'lucide-react';

interface GamificationStatsProps {
  timerCount: number;
  pomodoroCount: number;
  focusModeCount: number;
  goalsCompleted: number;
  streak: number;
  productivityScore: number;
  totalTimeToday: number;
  activities: any[];
}

export const GamificationStats: React.FC<GamificationStatsProps> = ({
  timerCount,
  pomodoroCount,
  focusModeCount,
  goalsCompleted,
  streak,
  productivityScore,
  totalTimeToday,
  activities
}) => {
  const stats = [
    {
      label: 'Timers Set',
      value: timerCount,
      icon: Timer,
      color: 'bg-blue-500',
      achievement: timerCount >= 50 ? '🎯 Timer Master' : timerCount >= 25 ? '⏰ Timer Pro' : null
    },
    {
      label: 'Pomodoros',
      value: pomodoroCount,
      icon: Target,
      color: 'bg-red-500',
      achievement: pomodoroCount >= 30 ? '🍅 Pomodoro Master' : pomodoroCount >= 15 ? '🍅 Pomodoro Pro' : null
    },
    {
      label: 'Focus Sessions',
      value: focusModeCount,
      icon: Zap,
      color: 'bg-yellow-500',
      achievement: focusModeCount >= 20 ? '⚡ Focus Master' : focusModeCount >= 10 ? '⚡ Focus Champion' : null
    },
    {
      label: 'Goals Completed',
      value: goalsCompleted,
      icon: Trophy,
      color: 'bg-green-500',
      achievement: goalsCompleted >= 10 ? '🏆 Goal Master' : goalsCompleted >= 5 ? '🏆 Goal Achiever' : null
    }
  ];

  const exportData = (format: 'csv' | 'pdf') => {
    const today = new Date().toDateString();
    const todaysActivities = activities.filter(activity => 
      new Date(activity.startTime).toDateString() === today
    );

    if (format === 'csv') {
      const csvContent = [
        'Activity,Duration (minutes),Category,Start Time',
        ...todaysActivities.map(activity => 
          `"${activity.name}",${Math.round(activity.duration / 60)},"${activity.category}","${new Date(activity.startTime).toLocaleString()}"`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timeflow-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // For PDF, we'll create a simple text format (in a real app, you'd use a PDF library)
      const pdfContent = [
        'TimeFlow Daily Report',
        `Date: ${new Date().toLocaleDateString()}`,
        `Total Time: ${Math.floor(totalTimeToday / 60)}h ${totalTimeToday % 60}m`,
        `Productivity Score: ${productivityScore}%`,
        '',
        'Activities:',
        ...todaysActivities.map(activity => 
          `- ${activity.name} (${Math.round(activity.duration / 60)}m) - ${activity.category}`
        )
      ].join('\n');

      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timeflow-report-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Detailed productivity score breakdown
  const productivityBreakdown = {
    timeBonus: Math.min(40, Math.round((totalTimeToday / 60) * 5)),
    streakBonus: Math.min(20, streak * 2),
    timerBonus: Math.min(15, timerCount * 2),
    pomodoroBonus: Math.min(15, pomodoroCount * 3),
    focusBonus: Math.min(10, focusModeCount * 2)
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Your Stats & Productivity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Productivity Score Breakdown */}
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-500/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-3xl font-bold text-white">{productivityScore}%</div>
              <div className="text-white/80 text-sm">Productivity Score</div>
            </div>
            <div className="text-3xl">📊</div>
          </div>
          <div className="space-y-1 text-xs text-white/80">
            <div className="flex justify-between">
              <span>Time Bonus ({Math.floor(totalTimeToday / 60)}h)</span>
              <span>+{productivityBreakdown.timeBonus}%</span>
            </div>
            <div className="flex justify-between">
              <span>Streak Bonus ({streak} days)</span>
              <span>+{productivityBreakdown.streakBonus}%</span>
            </div>
            <div className="flex justify-between">
              <span>Timer Bonus ({timerCount} timers)</span>
              <span>+{productivityBreakdown.timerBonus}%</span>
            </div>
            <div className="flex justify-between">
              <span>Pomodoro Bonus ({pomodoroCount} sessions)</span>
              <span>+{productivityBreakdown.pomodoroBonus}%</span>
            </div>
            <div className="flex justify-between">
              <span>Focus Bonus ({focusModeCount} sessions)</span>
              <span>+{productivityBreakdown.focusBonus}%</span>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => exportData('csv')}
            size="sm"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          >
            <FileText className="w-4 h-4 mr-1" />
            CSV
          </Button>
          <Button 
            onClick={() => exportData('pdf')}
            size="sm"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            <Download className="w-4 h-4 mr-1" />
            Report
          </Button>
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
            {timerCount < 25 && <div>🎯 Set {25 - timerCount} more timers for Timer Pro</div>}
            {timerCount >= 25 && timerCount < 50 && <div>🎯 Set {50 - timerCount} more timers for Timer Master</div>}
            {pomodoroCount < 15 && <div>🍅 Complete {15 - pomodoroCount} more pomodoros for Pomodoro Pro</div>}
            {pomodoroCount >= 15 && pomodoroCount < 30 && <div>🍅 Complete {30 - pomodoroCount} more pomodoros for Pomodoro Master</div>}
            {focusModeCount < 10 && <div>⚡ Use focus mode {10 - focusModeCount} more times for Focus Champion</div>}
            {focusModeCount >= 10 && focusModeCount < 20 && <div>⚡ Use focus mode {20 - focusModeCount} more times for Focus Master</div>}
            {goalsCompleted < 5 && <div>🏆 Complete {5 - goalsCompleted} more goals for Goal Achiever</div>}
            {goalsCompleted >= 5 && goalsCompleted < 10 && <div>🏆 Complete {10 - goalsCompleted} more goals for Goal Master</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
