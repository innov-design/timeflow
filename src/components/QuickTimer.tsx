
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';

export const QuickTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setQuickTime = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Quick Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white font-mono">
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            onClick={() => setQuickTime(5)}
            size="sm"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            5min
          </Button>
          <Button 
            onClick={() => setQuickTime(15)}
            size="sm"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            15min
          </Button>
          <Button 
            onClick={() => setQuickTime(30)}
            size="sm"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            30min
          </Button>
        </div>
        {timeLeft > 0 && (
          <Button 
            onClick={toggleTimer}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
