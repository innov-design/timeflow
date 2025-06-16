
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';
import { Activity } from './TimeFlowDashboard';
import { categorizeActivity, getCategoryColor, getCategoryEmoji } from '@/utils/aiCategorizer';

interface CategoryDistributionProps {
  activities: Activity[];
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ activities }) => {
  // Get today's activities
  const today = new Date().toDateString();
  const todaysActivities = activities.filter(activity => 
    new Date(activity.startTime).toDateString() === today
  );

  // Calculate category totals including multi-category activities
  const categoryTotals = todaysActivities.reduce((acc, activity) => {
    const categories = categorizeActivity(activity.name);
    categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += activity.duration;
    });
    return acc;
  }, {} as Record<string, number>);

  const totalTime = Object.values(categoryTotals).reduce((sum, time) => sum + time, 0);

  // Sort categories by time spent
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8); // Show top 8 categories

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (totalTime === 0) {
    return (
      <Card className="glass-effect border-white/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-sm">
            <PieChart className="w-4 h-4" />
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-white/60 text-center py-4 text-xs">
            No activities tracked today
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <PieChart className="w-4 h-4" />
          Today's Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Horizontal Progress Bar */}
        <div className="relative h-6 bg-white/10 rounded-full overflow-hidden">
          {sortedCategories.reduce((acc, [category, time], index) => {
            const percentage = (time / totalTime) * 100;
            const previousPercentage = acc.total;
            acc.total += percentage;
            
            return {
              ...acc,
              bars: [
                ...acc.bars,
                <div
                  key={category}
                  className="absolute h-full transition-all duration-300"
                  style={{
                    backgroundColor: getCategoryColor(category),
                    left: `${previousPercentage}%`,
                    width: `${percentage}%`,
                  }}
                  title={`${category}: ${formatTime(time)} (${Math.round(percentage)}%)`}
                />
              ]
            };
          }, { total: 0, bars: [] as React.ReactNode[] }).bars}
        </div>

        {/* Category Legend */}
        <div className="space-y-1.5">
          {sortedCategories.map(([category, time]) => {
            const percentage = Math.round((time / totalTime) * 100);
            return (
              <div key={category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(category) }}
                  />
                  <span className="text-white/80 truncate">
                    {getCategoryEmoji(category)} {category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/60 flex-shrink-0">
                  <span>{formatTime(time)}</span>
                  <span>({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Time */}
        <div className="pt-2 border-t border-white/20">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Total Time</span>
            <span className="text-white font-medium">{formatTime(totalTime)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
