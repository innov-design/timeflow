
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';

interface FocusModeProps {
  onActivate?: () => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({ onActivate }) => {
  const [focusStreak, setFocusStreak] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const startFocus = () => {
    setIsFocused(true);
    onActivate?.();
    // In a real app, this would disable notifications, etc.
  };

  const endFocus = () => {
    setIsFocused(false);
    setFocusStreak(prev => prev + 1);
  };

  return (
    <Card className="glass-effect border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Focus Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge 
            variant="secondary" 
            className={`mb-2 ${isFocused ? 'bg-green-500 text-white' : 'bg-white/20 text-white'}`}
          >
            {isFocused ? 'Focused' : 'Not Focused'}
          </Badge>
          <div className="text-white/80 text-sm">
            Streak: {focusStreak}
          </div>
        </div>
        <Button 
          onClick={isFocused ? endFocus : startFocus}
          className={`w-full ${isFocused ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          {isFocused ? 'End Focus' : 'Start Focus'}
        </Button>
      </CardContent>
    </Card>
  );
};
