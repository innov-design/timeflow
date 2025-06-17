
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProductivityScoreData } from '@/utils/productivityScoring';

interface ProductivityScoreBreakdownProps {
  scoreData: ProductivityScoreData;
  streak: number;
}

export const ProductivityScoreBreakdown: React.FC<ProductivityScoreBreakdownProps> = ({
  scoreData,
  streak
}) => {
  return (
    <>
      {/* Score Breakdown */}
      <div className="space-y-2">
        <div className="text-white/80 text-xs font-medium">Components:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/70">Tasks</span>
            <span className="text-white">{Math.round(scoreData.taskScore)}/30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Habits</span>
            <span className="text-white">{Math.round(scoreData.habitScore)}/25</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Activities</span>
            <span className="text-white">{Math.round(scoreData.activityScore)}/35</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Bonus</span>
            <span className="text-white">{Math.round(scoreData.bonusScore)}/10</span>
          </div>
        </div>
      </div>

      {/* Bonus Points */}
      <div className="space-y-1">
        <div className="text-white/80 text-xs font-medium">
          Bonuses: +{Math.round(scoreData.bonusScore)} | Penalties: -{Math.round(scoreData.penalties)}
        </div>
        <div className="flex flex-wrap gap-1">
          {streak > 0 && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
              🔥 Streak +{Math.round((scoreData.streakMultiplier - 1) * 100)}%
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="text-white font-medium">{Math.round(scoreData.breakdown.activities.totalTime / 3600 * 10) / 10}h</div>
          <div className="text-white/60">Active Time</div>
        </div>
        <div className="text-center">
          <div className="text-white font-medium">{scoreData.breakdown.tasks.completed}/{scoreData.breakdown.tasks.total}</div>
          <div className="text-white/60">Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-white font-medium">{scoreData.breakdown.habits.completed}/{scoreData.breakdown.habits.total}</div>
          <div className="text-white/60">Habits</div>
        </div>
      </div>
    </>
  );
};
