import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Play, Timer, RotateCcw } from 'lucide-react';
import { Activity } from './TimeFlowDashboard';
import { categorizeActivity } from '@/utils/aiCategorizer';

interface ActiveTimerProps {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (id: string, updates: Partial<Activity>) => void;
}

export const ActiveTimer: React.FC<ActiveTimerProps> = ({ 
  activities, 
  onAddActivity, 
  onUpdateActivity 
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);

  // Add past activity form
  const [pastActivityName, setPastActivityName] = useState('');
  const [pastDescription, setPastDescription] = useState('');
  const [pastHours, setPastHours] = useState('');
  const [pastMinutes, setPastMinutes] = useState('');
  const [pastStartTime, setPastStartTime] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!activityName.trim()) return;
    
    const newActivity: Omit<Activity, 'id'> = {
      name: activityName,
      description,
      duration: 0,
      startTime: new Date(),
      category: categorizeActivity(activityName),
      isActive: true
    };
    
    const tempId = Date.now().toString();
    onAddActivity({ ...newActivity });
    setActiveActivityId(tempId);
    setIsRunning(true);
    setCurrentTime(0);
  };

  const stopTimer = () => {
    if (activeActivityId) {
      onUpdateActivity(activeActivityId, {
        duration: currentTime,
        endTime: new Date(),
        isActive: false
      });
    }
    
    setIsRunning(false);
    setCurrentTime(0);
    setActivityName('');
    setDescription('');
    setActiveActivityId(null);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentTime(0);
    if (activeActivityId) {
      onUpdateActivity(activeActivityId, {
        duration: 0,
        isActive: false
      });
      setActiveActivityId(null);
    }
  };

  const addPastActivity = () => {
    if (!pastActivityName.trim() || !pastHours || !pastMinutes) return;
    
    const totalMinutes = parseInt(pastHours) * 60 + parseInt(pastMinutes);
    const totalSeconds = totalMinutes * 60;
    
    let startTime = new Date();
    if (pastStartTime) {
      const [hours, minutes] = pastStartTime.split(':');
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      startTime.setTime(startTime.getTime() - totalSeconds * 1000);
    }
    
    const endTime = new Date(startTime.getTime() + totalSeconds * 1000);
    
    const newActivity: Omit<Activity, 'id'> = {
      name: pastActivityName,
      description: pastDescription,
      duration: totalSeconds,
      startTime,
      endTime,
      category: categorizeActivity(pastActivityName),
      isActive: false
    };
    
    onAddActivity(newActivity);
    
    // Reset form
    setPastActivityName('');
    setPastDescription('');
    setPastHours('');
    setPastMinutes('');
    setPastStartTime('');
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Active Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Timer */}
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-4 font-mono">
            {formatTime(currentTime)}
          </div>
          <div className="flex gap-2 justify-center">
            {!isRunning ? (
              <Button 
                onClick={startTimer}
                disabled={!activityName.trim()}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                START
              </Button>
            ) : (
              <Button 
                onClick={stopTimer}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                STOP
              </Button>
            )}
            <Button 
              onClick={resetTimer}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              RESET
            </Button>
          </div>
        </div>

        {/* Activity Form */}
        <div className="space-y-4">
          <Input
            placeholder="Activity name"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            disabled={isRunning}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isRunning}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60 resize-none"
            rows={3}
          />
          {!isRunning && (
            <Button 
              onClick={startTimer}
              disabled={!activityName.trim()}
              className="w-full bg-primary hover:bg-primary/90"
            >
              ADD CURRENT ACTIVITY
            </Button>
          )}
        </div>

        {/* Add Past Activity */}
        <div className="border-t border-white/20 pt-6 space-y-4">
          <h3 className="text-white font-semibold">Add Past Activity</h3>
          <Input
            placeholder="Activity name"
            value={pastActivityName}
            onChange={(e) => setPastActivityName(e.target.value)}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
          />
          <Textarea
            placeholder="Description (optional)"
            value={pastDescription}
            onChange={(e) => setPastDescription(e.target.value)}
            className="bg-white/10 border-white/30 text-white placeholder:text-white/60 resize-none"
            rows={2}
          />
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Hours"
              type="number"
              min="0"
              value={pastHours}
              onChange={(e) => setPastHours(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
            />
            <Input
              placeholder="Minutes"
              type="number"
              min="0"
              max="59"
              value={pastMinutes}
              onChange={(e) => setPastMinutes(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
            />
            <Input
              placeholder="Start Time"
              type="time"
              value={pastStartTime}
              onChange={(e) => setPastStartTime(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
            />
          </div>
          <Button 
            onClick={addPastActivity}
            disabled={!pastActivityName.trim() || !pastHours || !pastMinutes}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            ADD PAST ACTIVITY
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
