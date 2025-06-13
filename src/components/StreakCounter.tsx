
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Target } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: 'Master', color: 'bg-purple-500', icon: '👑' };
    if (streak >= 21) return { level: 'Expert', color: 'bg-orange-500', icon: '🥇' };
    if (streak >= 14) return { level: 'Pro', color: 'bg-blue-500', icon: '💎' };
    if (streak >= 7) return { level: 'Committed', color: 'bg-green-500', icon: '🎯' };
    if (streak >= 3) return { level: 'Getting Started', color: 'bg-yellow-500', icon: '⭐' };
    return { level: 'Beginner', color: 'bg-gray-500', icon: '🌱' };
  };

  const streakInfo = getStreakLevel(streak);

  const milestones = [
    { days: 3, label: 'First Steps', reached: streak >= 3 },
    { days: 7, label: 'Week Warrior', reached: streak >= 7 },
    { days: 14, label: 'Two Week Pro', reached: streak >= 14 },
    { days: 21, label: 'Habit Former', reached: streak >= 21 },
    { days: 30, label: 'Month Master', reached: streak >= 30 },
  ];

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Streak Counter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Streak */}
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <span className="text-3xl">{streakInfo.icon}</span>
            {streak}
          </div>
          <Badge className={`${streakInfo.color} text-white mb-2`}>
            {streakInfo.level}
          </Badge>
          <div className="text-white/80 text-sm">
            {streak === 0 ? 'Start your streak today!' : 
             streak === 1 ? 'Great start! Keep it up!' :
             `${streak} days strong! 🔥`}
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          <h4 className="text-white font-medium text-sm">Milestones</h4>
          {milestones.map((milestone, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-2 rounded-lg ${
                milestone.reached ? 'bg-green-500/20' : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                {milestone.reached ? (
                  <Trophy className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Target className="w-4 h-4 text-white/40" />
                )}
                <span className={`text-sm ${milestone.reached ? 'text-green-300' : 'text-white/60'}`}>
                  {milestone.label}
                </span>
              </div>
              <span className={`text-sm ${milestone.reached ? 'text-green-300' : 'text-white/40'}`}>
                {milestone.days} days
              </span>
            </div>
          ))}
        </div>

        {/* Motivation */}
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-white/80 text-sm">
            {streak === 0 && "Every expert was once a beginner. Start today! 💪"}
            {streak >= 1 && streak < 3 && "Consistency is key. You're building something great! 🌟"}
            {streak >= 3 && streak < 7 && "You're developing discipline. Keep the momentum! 🚀"}
            {streak >= 7 && streak < 14 && "One week down! You're proving your commitment! 🎯"}
            {streak >= 14 && streak < 21 && "Two weeks! You're on fire! 🔥"}
            {streak >= 21 && streak < 30 && "21 days! You're forming a lasting habit! 💎"}
            {streak >= 30 && "Month master! You're an inspiration! 👑"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
