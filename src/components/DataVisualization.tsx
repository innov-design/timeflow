
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText, TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity } from './TimeFlowDashboard';

interface DataVisualizationProps {
  activities: Activity[];
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ activities }) => {
  // Calculate hourly distribution
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourActivities = activities.filter(activity => {
      const activityHour = new Date(activity.startTime).getHours();
      return activityHour === hour;
    });
    const totalMinutes = hourActivities.reduce((sum, activity) => sum + activity.duration, 0) / 60;
    
    return {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      minutes: Math.round(totalMinutes),
      activities: hourActivities.length
    };
  });

  // Calculate monthly data (last 30 days)
  const monthlyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayActivities = activities.filter(activity => 
      new Date(activity.startTime).toDateString() === date.toDateString()
    );
    const totalHours = dayActivities.reduce((sum, activity) => sum + activity.duration, 0) / 3600;
    
    return {
      date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      hours: Math.round(totalHours * 10) / 10,
      activities: dayActivities.length
    };
  }).reverse();

  // Category pie chart data
  const categoryData = activities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + activity.duration;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, duration], index) => ({
    name: category,
    value: Math.round(duration / 3600 * 10) / 10, // Convert to hours
    percentage: Math.round((duration / Object.values(categoryData).reduce((a, b) => a + b, 0)) * 100),
    color: `hsl(${(index * 137.5) % 360}, 70%, 60%)`
  }));

  // Productivity trend (last 7 days)
  const productivityTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayActivities = activities.filter(activity => 
      new Date(activity.startTime).toDateString() === date.toDateString()
    );
    const totalHours = dayActivities.reduce((sum, activity) => sum + activity.duration, 0) / 3600;
    const score = Math.min(100, Math.round(totalHours * 10 + dayActivities.length * 5));
    
    return {
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      score,
      hours: Math.round(totalHours * 10) / 10
    };
  }).reverse();

  const exportDetailedData = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvContent = [
        'Date,Activity,Duration (hours),Category,Start Time,End Time',
        ...activities.map(activity => 
          `"${new Date(activity.startTime).toLocaleDateString()}","${activity.name}",${(activity.duration / 3600).toFixed(2)},"${activity.category}","${new Date(activity.startTime).toLocaleString()}","${activity.endTime ? new Date(activity.endTime).toLocaleString() : 'In Progress'}"`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timeflow-complete-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Category Distribution Pie Chart */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Time Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <>
              <ChartContainer config={{}} className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
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
                    <ChartTooltip 
                      formatter={(value) => [`${value}h`, 'Time']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="space-y-1 mt-2">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-white/80">{item.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {item.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-white/60 text-center py-8">No data available</div>
          )}
        </CardContent>
      </Card>

      {/* Hourly Activity Pattern */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <XAxis 
                  dataKey="hour" 
                  tick={{ fill: '#fff', fontSize: 10 }}
                  interval={3}
                />
                <YAxis tick={{ fill: '#fff', fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#8884d8" 
                  fill="url(#colorMinutes)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Progress */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            30-Day Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#fff', fontSize: 10 }}
                  interval={5}
                />
                <YAxis tick={{ fill: '#fff', fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="glass-effect border-white/20 lg:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Export Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              onClick={() => exportDetailedData('csv')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Complete CSV
            </Button>
            <Button 
              onClick={() => exportDetailedData('pdf')}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Full Report
            </Button>
            <Button 
              onClick={() => {
                const categoryCSV = [
                  'Category,Total Hours,Percentage',
                  ...pieData.map(item => `"${item.name}",${item.value},${item.percentage}%`)
                ].join('\n');
                const blob = new Blob([categoryCSV], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'category-breakdown.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Categories
            </Button>
            <Button 
              onClick={() => {
                const hourlyCSV = [
                  'Hour,Minutes,Activities',
                  ...hourlyData.map(item => `"${item.hour}",${item.minutes},${item.activities}`)
                ].join('\n');
                const blob = new Blob([hourlyCSV], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'hourly-pattern.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Daily Pattern
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
