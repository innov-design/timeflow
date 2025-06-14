
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export const CustomTimer = () => {
  const [inputMinutes, setInputMinutes] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

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

  const setCustomTime = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setInputMinutes(minutes.toString());
    setShowTimer(true);
    setIsRunning(false);
  };

  const startTimer = () => {
    if (!showTimer && inputMinutes) {
      const minutes = parseInt(inputMinutes);
      if (minutes > 0) {
        setTimeLeft(minutes * 60);
        setShowTimer(true);
      }
    }
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setShowTimer(false);
    setInputMinutes('');
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Custom Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showTimer ? (
          <>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Enter minutes"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-center"
                min="1"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                onClick={() => setCustomTime(5)}
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                5min
              </Button>
              <Button 
                onClick={() => setCustomTime(15)}
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                15min
              </Button>
              <Button 
                onClick={() => setCustomTime(30)}
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                30min
              </Button>
            </div>
            {inputMinutes && (
              <Button 
                onClick={startTimer}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                Set Timer
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="text-3xl font-bold text-white font-mono">
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={startTimer}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button 
                onClick={resetTimer}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
