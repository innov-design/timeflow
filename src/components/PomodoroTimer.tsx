
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Timer } from 'lucide-react';

interface PomodoroTimerProps {
  onComplete?: () => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Switch session
      if (session === 'work') {
        onComplete?.();
        setSession('break');
        setTimeLeft(5 * 60); // 5 minute break
      } else {
        setSession('work');
        setTimeLeft(25 * 60); // 25 minute work
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, session, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startPause = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setSession('work');
    setTimeLeft(25 * 60);
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-3xl font-bold text-white font-mono">
          {formatTime(timeLeft)}
        </div>
        <div className="text-white/80 capitalize">
          {session} Session
        </div>
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={startPause}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white border-0"
          >
            <Play className="w-4 h-4 mr-1" />
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button 
            onClick={reset}
            size="sm"
            className="bg-gray-600 hover:bg-gray-700 text-white border-0"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
