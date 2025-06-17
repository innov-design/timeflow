
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Plus, Minus } from 'lucide-react';
import { calculateHealthScore, getHealthScoreColor, getHealthScoreLabel, HealthCounters } from '@/utils/healthScoring';

interface HealthScoreCardProps {
  activities: any[];
  healthCounters: HealthCounters;
  onUpdateCounters: (counters: HealthCounters) => void;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  activities,
  healthCounters,
  onUpdateCounters
}) => {
  const healthData = calculateHealthScore(healthCounters, activities);

  const updateCounter = (type: keyof HealthCounters, delta: number) => {
    const newCounters = {
      ...healthCounters,
      [type]: Math.max(0, healthCounters[type] + delta)
    };
    onUpdateCounters(newCounters);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}min`;
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4" />
          Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Health Score Display */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getHealthScoreColor(healthData.healthScore)}`}>
            {healthData.healthScore}%
          </div>
          <div className="text-white/80 text-xs">{getHealthScoreLabel(healthData.healthScore)}</div>
          <Progress value={healthData.healthScore} className="mt-2 h-2" />
        </div>

        {/* Health Counters */}
        <div className="space-y-2">
          <div className="text-white/80 text-xs font-medium">Daily Targets:</div>
          
          {/* Water */}
          <div className="flex items-center justify-between p-2 bg-white/5 rounded">
            <div className="flex items-center gap-2">
              <span className="text-sm">💧</span>
              <span className="text-white text-xs">Water</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => updateCounter('water', -1)}
                className="w-6 h-6 p-0 bg-white/20 hover:bg-white/30"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs min-w-[40px]">
                {healthCounters.water}/8
              </Badge>
              <Button
                size="sm"
                onClick={() => updateCounter('water', 1)}
                className="w-6 h-6 p-0 bg-white/20 hover:bg-white/30"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Meals */}
          <div className="flex items-center justify-between p-2 bg-white/5 rounded">
            <div className="flex items-center gap-2">
              <span className="text-sm">🍽️</span>
              <span className="text-white text-xs">Meals</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => updateCounter('meals', -1)}
                className="w-6 h-6 p-0 bg-white/20 hover:bg-white/30"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs min-w-[40px]">
                {healthCounters.meals}/3
              </Badge>
              <Button
                size="sm"
                onClick={() => updateCounter('meals', 1)}
                className="w-6 h-6 p-0 bg-white/20 hover:bg-white/30"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Fruits & Vegetables */}
          <div className="flex items-center justify-between p-2 bg-white/5 rounded">
            <div className="flex items-center gap-2">
              <span className="text-sm">🥬</span>
              <span className="text-white text-xs">Fruits & Veggies</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => updateCounter('fruitsVeggies', -1)}
                className="w-6 h-6 p-0 bg-white/20 hover:bg-white/30"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs min-w-[40px]">
                {healthCounters.fruitsVeggies}/5
              </Badge>
              <Button
                size="sm"
                onClick={() => updateCounter('fruitsVeggies', 1)}
                className="w-6 h-6 p-0 bg-white/20 hover:bg-white/30"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Fitness Time */}
        <div className="text-center p-2 bg-white/5 rounded">
          <div className="text-white text-xs">💪 Fitness Today</div>
          <div className="text-white font-medium text-sm">{formatTime(healthData.fitnessTime)}</div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/70">Water</span>
            <span className="text-white">{healthData.breakdown.waterScore}/25</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Meals</span>
            <span className="text-white">{healthData.breakdown.mealScore}/25</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Fruits/Veggies</span>
            <span className="text-white">{healthData.breakdown.fruitsVeggiesScore}/25</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Fitness</span>
            <span className="text-white">{healthData.breakdown.fitnessScore}/25</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
