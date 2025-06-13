
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calculator, Plus, Minus, Clock } from 'lucide-react';

export const TimeCalculator = () => {
  const [timeEntries, setTimeEntries] = useState<{ hours: string; minutes: string }[]>([
    { hours: '', minutes: '' }
  ]);
  const [result, setResult] = useState<{ hours: number; minutes: number } | null>(null);

  const addTimeEntry = () => {
    setTimeEntries([...timeEntries, { hours: '', minutes: '' }]);
  };

  const removeTimeEntry = (index: number) => {
    if (timeEntries.length > 1) {
      setTimeEntries(timeEntries.filter((_, i) => i !== index));
    }
  };

  const updateTimeEntry = (index: number, field: 'hours' | 'minutes', value: string) => {
    const newEntries = [...timeEntries];
    newEntries[index][field] = value;
    setTimeEntries(newEntries);
  };

  const calculateTotal = () => {
    let totalMinutes = 0;
    
    timeEntries.forEach(entry => {
      const hours = parseInt(entry.hours) || 0;
      const minutes = parseInt(entry.minutes) || 0;
      totalMinutes += hours * 60 + minutes;
    });
    
    const resultHours = Math.floor(totalMinutes / 60);
    const resultMinutes = totalMinutes % 60;
    
    setResult({ hours: resultHours, minutes: resultMinutes });
  };

  const calculateAverage = () => {
    let totalMinutes = 0;
    let validEntries = 0;
    
    timeEntries.forEach(entry => {
      const hours = parseInt(entry.hours) || 0;
      const minutes = parseInt(entry.minutes) || 0;
      if (hours > 0 || minutes > 0) {
        totalMinutes += hours * 60 + minutes;
        validEntries++;
      }
    });
    
    if (validEntries === 0) {
      setResult({ hours: 0, minutes: 0 });
      return;
    }
    
    const avgMinutes = Math.round(totalMinutes / validEntries);
    const resultHours = Math.floor(avgMinutes / 60);
    const resultMins = avgMinutes % 60;
    
    setResult({ hours: resultHours, minutes: resultMins });
  };

  const clear = () => {
    setTimeEntries([{ hours: '', minutes: '' }]);
    setResult(null);
  };

  return (
    <Card className="glass-effect border-white/20 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Time Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Entries */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Time Entries</h3>
          {timeEntries.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="number"
                  placeholder="Hours"
                  value={entry.hours}
                  onChange={(e) => updateTimeEntry(index, 'hours', e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  min="0"
                />
                <span className="text-white">h</span>
                <Input
                  type="number"
                  placeholder="Minutes"
                  value={entry.minutes}
                  onChange={(e) => updateTimeEntry(index, 'minutes', e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
                  min="0"
                  max="59"
                />
                <span className="text-white">m</span>
              </div>
              {timeEntries.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeTimeEntry(index)}
                  className="text-red-400 hover:bg-red-500/20"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            onClick={addTimeEntry}
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>

        {/* Calculation Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={calculateTotal}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Sum Total
          </Button>
          <Button
            onClick={calculateAverage}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Average
          </Button>
          <Button
            onClick={clear}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Clear
          </Button>
        </div>

        {/* Result */}
        {result && (
          <Card className="bg-white/10 border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 text-white mx-auto mb-2" />
                <div className="text-3xl font-bold text-white font-mono">
                  {result.hours}h {result.minutes}m
                </div>
                <div className="text-white/60 text-sm mt-1">
                  Total: {result.hours * 60 + result.minutes} minutes
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Conversions */}
        <div className="border-t border-white/20 pt-4">
          <h3 className="text-white font-medium mb-3">Quick Conversions</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-white/80">
              <div>1 hour = 60 minutes</div>
              <div>1 day = 24 hours</div>
              <div>1 week = 168 hours</div>
            </div>
            <div className="text-white/80">
              <div>8 hours = 480 minutes</div>
              <div>40 hours = 2400 minutes</div>
              <div>1 month ≈ 730 hours</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
