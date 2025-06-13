import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Clock, Play, Pause, Plus } from 'lucide-react';
import { Activity } from './TimeFlowDashboard';
import { categorizeActivity } from '@/utils/aiCategorizer';

interface ActiveTimerProps {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (id: string, updates: Partial<Activity>) => void;
}

export const ActiveTimer: React.FC<ActiveTimerProps> = ({ activities, onAddActivity, onUpdateActivity }) => {
  const [activityName, setActivityName] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pastDuration, setPastDuration] = useState(30);
  const [showPastActivityForm, setShowPastActivityForm] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStopTimer = () => {
    setIsRunning(false);
    const durationInSeconds = Math.floor(elapsedTime / 1000);

    const currentActivity = activities.find(activity => activity.isActive);
    if (currentActivity) {
      onUpdateActivity(currentActivity.id, { 
        duration: durationInSeconds, 
        endTime: new Date(), 
        isActive: false 
      });
    }
    setActivityName('');
    setActivityDescription('');
  };

  const handleAddPastActivity = () => {
    if (!activityName.trim()) return;
    
    const categories = categorizeActivity(activityName);
    const primaryCategory = categories[0] || 'Other';
    
    const activity: Omit<Activity, 'id'> = {
      name: activityName,
      description: activityDescription,
      duration: pastDuration * 60,
      startTime: new Date(Date.now() - pastDuration * 60 * 1000),
      endTime: new Date(),
      category: primaryCategory,
      isActive: false
    };
    
    onAddActivity(activity);
    setActivityName('');
    setActivityDescription('');
    setPastDuration(30);
    setShowPastActivityForm(false);
  };

  const startTimer = () => {
    if (!activityName.trim()) return;
    
    const categories = categorizeActivity(activityName);
    const primaryCategory = categories[0] || 'Other';
    
    const activity: Omit<Activity, 'id'> = {
      name: activityName,
      description: activityDescription,
      duration: 0,
      startTime: new Date(),
      category: primaryCategory,
      isActive: true
    };
    
    onAddActivity(activity);
    setIsRunning(true);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const activeActivity = activities.find(activity => activity.isActive);

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Active Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeActivity ? (
          <div className="text-center">
            <div className="text-2xl font-bold text-white font-mono">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-white/80">
              {activeActivity.name}
            </div>
            <Progress value={66} />
            <Button 
              onClick={handleStopTimer}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Stop Timer
            </Button>
          </div>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Activity name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
            />
            <Textarea
              placeholder="Activity description (optional)"
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 resize-none"
              rows={3}
            />
            <Button 
              onClick={startTimer}
              disabled={!activityName.trim()}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Start Timer
            </Button>
            <Button 
              onClick={() => setShowPastActivityForm(true)}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Past Activity
            </Button>
          </>
        )}

        {showPastActivityForm && (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Activity name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
            />
            <Textarea
              placeholder="Activity description (optional)"
              value={activityDescription}
              onChange={(e) => setActivityDescription(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 resize-none"
              rows={3}
            />
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={pastDuration.toString()}
              onChange={(e) => setPastDuration(parseInt(e.target.value))}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
            />
            <Button 
              onClick={handleAddPastActivity}
              disabled={!activityName.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add Activity
            </Button>
            <Button 
              onClick={() => setShowPastActivityForm(false)}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
