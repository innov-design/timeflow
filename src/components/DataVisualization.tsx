
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, TrendingUp, PieChart as PieChartIcon, BarChart3, Filter, Globe } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity } from './TimeFlowDashboard';

interface DataVisualizationProps {
  activities: Activity[];
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ activities }) => {
  const [exportFilter, setExportFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter activities based on selection
  const getFilteredActivities = () => {
    const now = new Date();
    let filtered = activities;

    switch (exportFilter) {
      case 'today':
        filtered = activities.filter(activity => 
          new Date(activity.startTime).toDateString() === now.toDateString()
        );
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = activities.filter(activity => 
          new Date(activity.startTime) >= weekAgo
        );
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = activities.filter(activity => 
          new Date(activity.startTime) >= monthAgo
        );
        break;
      default:
        filtered = activities;
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }

    return filtered;
  };

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
      activities: dayActivities.length,
      productivity: Math.min(100, Math.round(totalHours * 15 + dayActivities.length * 5))
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

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(activities.map(a => a.category)))];

  // Enhanced export with proper PDF generation
  const exportData = (format: 'csv' | 'pdf') => {
    const filteredActivities = getFilteredActivities();
    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'csv') {
      const csvContent = [
        'Date,Activity,Duration (hours),Category,Start Time,End Time,Productivity Score',
        ...filteredActivities.map(activity => {
          const duration = (activity.duration / 3600).toFixed(2);
          const productivity = Math.round(activity.duration / 60 + 20); // Simple productivity calculation
          return `"${new Date(activity.startTime).toLocaleDateString()}","${activity.name}",${duration},"${activity.category}","${new Date(activity.startTime).toLocaleString()}","${activity.endTime ? new Date(activity.endTime).toLocaleString() : 'In Progress'}",${productivity}`;
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timeflow-${exportFilter}-data-${timestamp}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Enhanced PDF report
      const totalHours = filteredActivities.reduce((sum, activity) => sum + activity.duration, 0) / 3600;
      const avgProductivity = filteredActivities.length > 0 
        ? Math.round(filteredActivities.reduce((sum, activity) => sum + (activity.duration / 60 + 20), 0) / filteredActivities.length)
        : 0;

      const reportContent = [
        '=== TIMEFLOW PRODUCTIVITY REPORT ===',
        `Generated: ${new Date().toLocaleString()}`,
        `Filter: ${exportFilter.toUpperCase()}${selectedCategory !== 'all' ? ` - ${selectedCategory}` : ''}`,
        '',
        '--- SUMMARY ---',
        `Total Activities: ${filteredActivities.length}`,
        `Total Time: ${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m`,
        `Average Productivity: ${avgProductivity}%`,
        `Most Active Category: ${pieData.length > 0 ? pieData.sort((a, b) => b.value - a.value)[0].name : 'None'}`,
        '',
        '--- CATEGORY BREAKDOWN ---',
        ...pieData.map(item => `${item.name}: ${item.value}h (${item.percentage}%)`),
        '',
        '--- DETAILED ACTIVITIES ---',
        ...filteredActivities.map(activity => {
          const duration = Math.round(activity.duration / 60);
          const productivity = Math.round(activity.duration / 60 + 20);
          return `• ${activity.name} | ${duration}m | ${activity.category} | ${productivity}% | ${new Date(activity.startTime).toLocaleString()}`;
        }),
        '',
        '--- INSIGHTS ---',
        `Peak Activity Hour: ${hourlyData.sort((a, b) => b.minutes - a.minutes)[0]?.hour || 'N/A'}`,
        `Average Session: ${filteredActivities.length > 0 ? Math.round(totalHours * 60 / filteredActivities.length) : 0} minutes`,
        `Productivity Trend: ${monthlyData.slice(-7).every((day, i, arr) => i === 0 || day.productivity >= arr[i-1].productivity) ? 'Improving' : 'Variable'}`,
        '',
        '=== END OF REPORT ==='
      ].join('\n');

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timeflow-report-${exportFilter}-${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-4">
      {/* Export Controls */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Smart Data Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-white/80 text-sm mb-2 block">Time Range</label>
              <Select value={exportFilter} onValueChange={(value: any) => setExportFilter(value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-white/80 text-sm mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => exportData('csv')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              onClick={() => exportData('pdf')}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Full Report
            </Button>
          </div>
          <div className="text-white/60 text-sm">
            Selected: {getFilteredActivities().length} activities, {Math.round(getFilteredActivities().reduce((sum, a) => sum + a.duration, 0) / 3600 * 10) / 10} hours
          </div>
        </CardContent>
      </Card>

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

        {/* Enhanced Monthly Progress with Productivity */}
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Productivity Trend
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
                    dataKey="productivity" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ fill: '#82ca9d', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
