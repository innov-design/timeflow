
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Edit3 } from 'lucide-react';
import { Activity } from './TimeFlowDashboard';
import { getCategoryColor, getCategoryEmoji, categorizeActivity } from '@/utils/aiCategorizer';

interface CategoryGoal {
  id: string;
  category: string;
  weeklyMinutes: number;
  currentMinutes: number;
}

interface CategoryGoalsProps {
  activities: Activity[];
  goals: CategoryGoal[];
  onAddGoal: (goal: Omit<CategoryGoal, 'id' | 'currentMinutes'>) => void;
  onUpdateGoal: (id: string, updates: Partial<CategoryGoal>) => void;
}

const categories = [
  'Technical Education',
  'Learning & Skills',
  'Business', 
  'Browsing',
  'Fitness',
  'Leisure',
  'Eating',
  'Time with Family'
];

export const CategoryGoals: React.FC<CategoryGoalsProps> = ({
  activities,
  goals,
  onAddGoal,
  onUpdateGoal
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [weeklyMinutes, setWeeklyMinutes] = useState('');
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  // Calculate current week's progress
  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.setDate(diff));
  };

  const calculateCategoryProgress = (category: string) => {
    const weekStart = getWeekStart();
    const weekActivities = activities.filter(activity => {
      const activityDate = new Date(activity.startTime);
      return activityDate >= weekStart;
    });
    
    // Calculate total time for activities that belong to this category
    return weekActivities.reduce((total, activity) => {
      const activityCategories = categorizeActivity(activity.name);
      if (activityCategories.includes(category)) {
        return total + activity.duration;
      }
      return total;
    }, 0);
  };

  const handleAddGoal = () => {
    if (!selectedCategory || !weeklyMinutes) return;
    
    onAddGoal({
      category: selectedCategory,
      weeklyMinutes: parseInt(weeklyMinutes) * 60 // Convert to seconds
    });
    
    setSelectedCategory('');
    setWeeklyMinutes('');
    setShowAddForm(false);
  };

  const updateGoalProgress = () => {
    goals.forEach(goal => {
      const currentMinutes = Math.floor(calculateCategoryProgress(goal.category) / 60);
      if (currentMinutes !== goal.currentMinutes) {
        onUpdateGoal(goal.id, { currentMinutes });
      }
    });
  };

  React.useEffect(() => {
    updateGoalProgress();
  }, [activities]);

  const availableCategories = categories.filter(cat => 
    !goals.some(goal => goal.category === cat)
  );

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Category Goals
          </CardTitle>
          {availableCategories.length > 0 && (
            <Button
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Goals */}
        {goals.map((goal) => {
          const currentMinutes = Math.floor(calculateCategoryProgress(goal.category) / 60);
          const targetMinutes = Math.floor(goal.weeklyMinutes / 60);
          const progress = Math.min((currentMinutes / targetMinutes) * 100, 100);
          const isCompleted = currentMinutes >= targetMinutes;
          
          return (
            <div key={goal.id} className="bg-white/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryEmoji(goal.category)}</span>
                  <span className="text-white font-medium">{goal.category}</span>
                  {isCompleted && (
                    <Badge className="bg-green-500 text-white">
                      ✅ Completed
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingGoal(editingGoal === goal.id ? null : goal.id)}
                  className="text-white/60 hover:bg-white/10"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white/80">
                  <span>{currentMinutes}m / {targetMinutes}m this week</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }}
                />
              </div>
              
              {editingGoal === goal.id && (
                <div className="flex gap-2 pt-2 border-t border-white/20">
                  <Input
                    type="number"
                    placeholder="Minutes per week"
                    defaultValue={targetMinutes}
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const newMinutes = parseInt((e.target as HTMLInputElement).value);
                        if (newMinutes > 0) {
                          onUpdateGoal(goal.id, { weeklyMinutes: newMinutes * 60 });
                          setEditingGoal(null);
                        }
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => setEditingGoal(null)}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Goal Form */}
        {showAddForm && (
          <div className="bg-white/10 rounded-lg p-4 space-y-4 border border-white/20">
            <h4 className="text-white font-medium">Add New Goal</h4>
            <div className="space-y-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white"
              >
                <option value="">Select Category</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category} className="bg-gray-800">
                    {getCategoryEmoji(category)} {category}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="Minutes per week"
                value={weeklyMinutes}
                onChange={(e) => setWeeklyMinutes(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAddGoal}
                  disabled={!selectedCategory || !weeklyMinutes}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Add Goal
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedCategory('');
                    setWeeklyMinutes('');
                  }}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {goals.length === 0 && !showAddForm && (
          <div className="text-white/60 text-center py-8">
            No goals set yet. Click "Add Goal" to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
};
