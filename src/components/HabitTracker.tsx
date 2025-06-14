import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, X, Target } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  target: number;
  unit: string;
  completed: boolean;
  streak: number;
  lastCompleted?: Date;
}

interface HabitTrackerProps {
  habits: Habit[];
  onAddHabit: (habit: Omit<Habit, 'id'>) => void;
  onToggleHabit: (id: string) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  onAddHabit,
  onToggleHabit
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTarget, setNewHabitTarget] = useState('1');
  const [newHabitUnit, setNewHabitUnit] = useState('time');

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    
    onAddHabit({
      name: newHabitName,
      target: parseInt(newHabitTarget),
      unit: newHabitUnit,
      completed: false,
      streak: 0
    });
    
    setNewHabitName('');
    setNewHabitTarget('1');
    setNewHabitUnit('time');
    setShowAddForm(false);
  };

  const defaultHabits = [
    { name: '🚰 Drink 8 glasses of water', target: 8, unit: 'glasses' },
    { name: '🏃‍♂️ Exercise 30 minutes', target: 30, unit: 'minutes' },
    { name: '📚 Read for 20 minutes', target: 20, unit: 'minutes' },
    { name: '🧘‍♀️ Meditate', target: 1, unit: 'session' },
    { name: '📱 No social media for 2 hours', target: 2, unit: 'hours' },
  ];

  const quickAddHabit = (habit: { name: string; target: number; unit: string }) => {
    onAddHabit({
      ...habit,
      completed: false,
      streak: 0
    });
  };

  const today = new Date().toDateString();
  const todaysCompletedHabits = habits.filter(habit => 
    habit.lastCompleted && new Date(habit.lastCompleted).toDateString() === today
  ).length;

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <Target className="w-4 h-4" />
          Daily Habits
          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
            {todaysCompletedHabits}/{habits.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Existing Habits */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {habits.map((habit) => {
            const isCompletedToday = habit.lastCompleted && 
              new Date(habit.lastCompleted).toDateString() === today;
            
            return (
              <div key={habit.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                <div className="flex-1">
                  <div className="text-white text-xs font-medium">{habit.name}</div>
                  <div className="text-white/60 text-xs">
                    🔥 {habit.streak} day streak
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onToggleHabit(habit.id)}
                  className={`w-8 h-8 p-0 ${
                    isCompletedToday 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {isCompletedToday ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <X className="w-4 h-4 text-white/60" />
                  )}
                </Button>
              </div>
            );
          })}
          
          {habits.length === 0 && (
            <div className="text-white/60 text-center py-4 text-xs">
              No habits yet. Add some to get started!
            </div>
          )}
        </div>

        {/* Quick Add Popular Habits */}
        {habits.length < 5 && (
          <div className="space-y-2">
            <div className="text-white/80 text-xs font-medium">Quick Add:</div>
            <div className="grid grid-cols-1 gap-1">
              {defaultHabits.slice(0, 3).map((habit, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => quickAddHabit(habit)}
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent text-xs h-8 justify-start"
                >
                  {habit.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Habit */}
        {!showAddForm ? (
          <Button
            onClick={() => setShowAddForm(true)}
            size="sm"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-8"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Custom Habit
          </Button>
        ) : (
          <div className="space-y-2">
            <Input
              placeholder="Habit name..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-8 text-xs"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Target"
                value={newHabitTarget}
                onChange={(e) => setNewHabitTarget(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 h-8 text-xs flex-1"
              />
              <select
                value={newHabitUnit}
                onChange={(e) => setNewHabitUnit(e.target.value)}
                className="bg-white/10 border border-white/30 text-white rounded px-2 h-8 text-xs flex-1"
              >
                <option value="time">times</option>
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
                <option value="glasses">glasses</option>
                <option value="pages">pages</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={addHabit}
                size="sm"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white h-8"
              >
                Add
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                size="sm"
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10 bg-transparent h-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
