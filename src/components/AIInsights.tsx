
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Clock, Target } from 'lucide-react';
import { Activity } from './TimeFlowDashboard';
import { getCategoryColor, getCategoryEmoji } from '@/utils/aiCategorizer';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

interface AIInsightsProps {
  activities: Activity[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ activities }) => {
  // Calculate category distribution
  const categoryData = activities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + activity.duration;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, duration]) => ({
    name: category,
    value: Math.round(duration / 60), // Convert to minutes
    color: getCategoryColor(category)
  }));

  // Calculate weekly trends
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  const weeklyData = last7Days.map(date => {
    const dayActivities = activities.filter(activity => 
      new Date(activity.startTime).toDateString() === date.toDateString()
    );
    const totalMinutes = dayActivities.reduce((total, activity) => total + activity.duration, 0) / 60;
    
    return {
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      minutes: Math.round(totalMinutes)
    };
  });

  // AI Insights
  const totalHours = activities.reduce((total, activity) => total + activity.duration, 0) / 3600;
  const avgDailyHours = totalHours / 7;
  const mostProductiveCategory = Object.entries(categoryData)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

  const insights = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Daily Average",
      value: `${avgDailyHours.toFixed(1)}h`,
      description: "Your average daily focus time"
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Top Category",
      value: mostProductiveCategory,
      description: "Where you spend most time"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Weekly Total",
      value: `${totalHours.toFixed(1)}h`,
      description: "Total time tracked this week"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* AI Insights Summary */}
      <Card className="glass-effect border-white/20 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Insights & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 text-white">
                  {insight.icon}
                  <span className="font-medium">{insight.title}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {insight.value}
                </div>
                <div className="text-white/60 text-sm">
                  {insight.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Time Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} min`, 'Time']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-white/80">{item.name}</span>
                    </div>
                    <span className="text-white font-medium">{item.value}m</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-white/60 text-center py-8">
              No data to display
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Weekly Activity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value} min`, 'Time']}
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="minutes" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card className="glass-effect border-white/20 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryData)
              .sort(([,a], [,b]) => b - a)
              .map(([category, duration]) => {
                const hours = duration / 3600;
                const percentage = (duration / Object.values(categoryData).reduce((a, b) => a + b, 0)) * 100;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryEmoji(category)}</span>
                        <span className="text-white font-medium">{category}</span>
                      </div>
                      <span className="text-white/80">
                        {hours.toFixed(1)}h ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
