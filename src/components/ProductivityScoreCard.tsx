
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, RotateCcw } from 'lucide-react';
import { calculateProductivityScore } from '@/utils/productivityScoring';
import { ProductivityScoreDisplay } from './ProductivityScoreDisplay';
import { ProductivityScoreBreakdown } from './ProductivityScoreBreakdown';

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
  const scoreData = calculateProductivityScore(
    activities,
    todos,
    habits,
    pomodoroCount,
    focusModeCount,
    streak
  );

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
        <ProductivityScoreDisplay finalScore={scoreData.finalScore} />
        <ProductivityScoreBreakdown scoreData={scoreData} streak={streak} />
      </CardContent>
    </Card>
  );
};
