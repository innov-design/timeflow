
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { getScoreColor, getScoreLabel } from '@/utils/productivityScoring';

interface ProductivityScoreDisplayProps {
  finalScore: number;
}

export const ProductivityScoreDisplay: React.FC<ProductivityScoreDisplayProps> = ({
  finalScore
}) => {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${getScoreColor(finalScore)}`}>
        {Math.round(finalScore)}%
      </div>
      <div className="text-white/80 text-xs">{getScoreLabel(finalScore)}</div>
      <Progress value={finalScore} className="mt-2 h-2" />
    </div>
  );
};
