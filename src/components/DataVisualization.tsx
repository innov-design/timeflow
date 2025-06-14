
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { Activity } from './TimeFlowDashboard';
import { categorizeActivity, getCategoryColor } from '@/utils/aiCategorizer';

interface DataVisualizationProps {
  activities: Activity[];
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ activities }) => {
  const [timeRange, setTimeRange] = useState('7');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter activities based on time range
  const getFilteredActivities = () => {
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.startTime);
      const matchesTime = activityDate >= cutoffDate;
      const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
      return matchesTime && matchesCategory;
    });
  };

  const filteredActivities = getFilteredActivities();

  // Generate export data
  const exportToCSV = () => {
    const headers = ['Date', 'Activity', 'Category', 'Duration (minutes)', 'Start Time', 'End Time'];
    const csvData = filteredActivities.map(activity => [
      new Date(activity.startTime).toLocaleDateString(),
      activity.name,
      activity.category,
      Math.round(activity.duration / 60),
      new Date(activity.startTime).toLocaleTimeString(),
      activity.endTime ? new Date(activity.endTime).toLocaleTimeString() : 'Ongoing'
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeflow-export-${timeRange}days-${selectedCategory}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const totalTime = filteredActivities.reduce((sum, activity) => sum + activity.duration, 0);
    const avgDailyTime = totalTime / parseInt(timeRange) / 3600;
    
    const categoryBreakdown = filteredActivities.reduce((acc, activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = { time: 0, count: 0 };
      }
      acc[activity.category].time += activity.duration;
      acc[activity.category].count += 1;
      return acc;
    }, {} as Record<string, { time: number; count: number }>);

    const report = `
TimeFlow Productivity Report
Generated: ${new Date().toLocaleString()}
Time Range: Last ${timeRange} days
Category Filter: ${selectedCategory === 'all' ? 'All Categories' : selectedCategory}

SUMMARY:
- Total Activities: ${filteredActivities.length}
- Total Time Tracked: ${Math.round(totalTime / 3600 * 10) / 10} hours
- Average Daily Time: ${Math.round(avgDailyTime * 10) / 10} hours

CATEGORY BREAKDOWN:
${Object.entries(categoryBreakdown)
  .sort(([,a], [,b]) => b.time - a.time)
  .map(([category, data]) => 
    `- ${category}: ${Math.round(data.time / 3600 * 10) / 10}h (${data.count} activities)`
  ).join('\n')}

TOP ACTIVITIES:
${filteredActivities
  .sort((a, b) => b.duration - a.duration)
  .slice(0, 10)
  .map((activity, index) => 
    `${index + 1}. ${activity.name} - ${Math.round(activity.duration / 60)}min`
  ).join('\n')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeflow-report-${timeRange}days-${selectedCategory}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get unique categories
  const categories = Array.from(new Set(activities.map(a => a.category)));

  // Prepare chart data
  const categoryData = filteredActivities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = { name: activity.category, value: 0, activities: 0 };
    }
    acc[activity.category].value += activity.duration;
    acc[activity.category].activities += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number; activities: number }>);

  const chartData = Object.values(categoryData).map(item => ({
    ...item,
    hours: Math.round(item.value / 3600 * 10) / 10
  }));

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Smart Data Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls Row - Properly aligned */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-white/80 text-sm">Time Range</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 1 day</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-white/80 text-sm">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={exportToCSV}
            className="bg-green-500 hover:bg-green-600 text-white"
            disabled={filteredActivities.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>

          <Button
            onClick={generateReport}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={filteredActivities.length === 0}
          >
            <FileText className="w-4 h-4 mr-2" />
            Full Report
          </Button>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <ChartContainer config={{}} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#fff', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="hours" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="text-white/60 text-center py-8">
            No data available for the selected filters
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {filteredActivities.length}
            </div>
            <div className="text-white/60 text-sm">Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round(filteredActivities.reduce((sum, a) => sum + a.duration, 0) / 3600 * 10) / 10}h
            </div>
            <div className="text-white/60 text-sm">Total Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {categories.length}
            </div>
            <div className="text-white/60 text-sm">Categories</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
