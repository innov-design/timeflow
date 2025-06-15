
// AI-driven productivity scoring for activities
export const getActivityProductivityScore = (activityName: string): number => {
  const activity = activityName.toLowerCase();
  
  // High productivity (0.8-1.0)
  if (activity.includes('codecademy') || activity.includes('coding') || 
      activity.includes('programming') || activity.includes('study') || 
      activity.includes('learn') || activity.includes('course') ||
      activity.includes('work') || activity.includes('meeting') ||
      activity.includes('training') || activity.includes('skill') ||
      activity.includes('book') || activity.includes('research') ||
      activity.includes('homework') || activity.includes('exam') ||
      activity.includes('practice') || activity.includes('tutorial') ||
      activity.includes('project') || activity.includes('lecture')) {
    return 0.9;
  }
  
  // Medium-high productivity (0.6-0.8)
  if (activity.includes('exercise') || activity.includes('workout') || 
      activity.includes('gym') || activity.includes('run') || 
      activity.includes('yoga') || activity.includes('fitness') ||
      activity.includes('planning') || activity.includes('organize') ||
      activity.includes('email') || activity.includes('communication') ||
      activity.includes('cooking') || activity.includes('clean')) {
    return 0.7;
  }
  
  // Medium productivity (0.4-0.6)
  if (activity.includes('travel') || activity.includes('shopping') || 
      activity.includes('errands') || activity.includes('maintenance') ||
      activity.includes('admin') || activity.includes('calls') ||
      activity.includes('walk') || activity.includes('commute') ||
      activity.includes('family time') || activity.includes('social')) {
    return 0.5;
  }
  
  // Low-medium productivity (0.2-0.4)
  if (activity.includes('tv') || activity.includes('movie') || 
      activity.includes('music') || activity.includes('game') ||
      activity.includes('leisure') || activity.includes('break') ||
      activity.includes('entertainment') || activity.includes('browsing')) {
    return 0.3;
  }
  
  // Low productivity (0.0-0.2)
  if (activity.includes('doomscroll') || activity.includes('social media') || 
      activity.includes('scrolling') || activity.includes('procrastinating') ||
      activity.includes('idle') || activity.includes('wasting time')) {
    return 0.1;
  }
  
  // Default medium-low for unknown activities
  return 0.4;
};

export const getScoreColor = (score: number): string => {
  if (score >= 90) return 'text-green-400';
  if (score >= 80) return 'text-blue-400';
  if (score >= 70) return 'text-yellow-400';
  if (score >= 60) return 'text-orange-400';
  return 'text-red-400';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Highly Productive';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Average';
  if (score >= 50) return 'Below Average';
  return 'Needs Improvement';
};

export interface ProductivityScoreData {
  taskScore: number;
  aiProductivityScore: number;
  focusScore: number;
  balanceScore: number;
  baseScore: number;
  bonusPoints: number;
  penalties: number;
  finalScore: number;
  averageProductivity: number;
  focusTime: number;
  completedTasks: number;
  totalTasks: number;
}

export const calculateProductivityScore = (
  activities: any[],
  todos: any[],
  habits: any[],
  pomodoroCount: number,
  focusModeCount: number,
  streak: number
): ProductivityScoreData => {
  const today = new Date().toDateString();
  const todaysActivities = activities.filter(activity => 
    new Date(activity.startTime).toDateString() === today
  );

  // Reset all scores to 0
  const completedTasks = 0;
  const totalTasks = todos.length;
  const taskScore = 0;
  const aiProductivityScore = 0;
  const focusTime = 0;
  const focusScore = 0;
  const averageProductivity = 0;

  // Category Balance calculation
  const categoryDistribution = todaysActivities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + activity.duration;
    return acc;
  }, {} as Record<string, number>);

  const totalTime = Object.values(categoryDistribution).reduce((sum, time) => sum + Number(time), 0);
  const workTime = Number(categoryDistribution['Work'] || 0) + 
                   Number(categoryDistribution['Education'] || 0) + 
                   Number(categoryDistribution['Learning'] || 0);
  const leisureTime = Number(categoryDistribution['Leisure'] || 0);
  const exerciseTime = Number(categoryDistribution['Exercise'] || 0) + 
                       Number(categoryDistribution['Fitness'] || 0);
  
  const workPercentage = totalTime > 0 ? (workTime / totalTime) * 100 : 0;
  const leisurePercentage = totalTime > 0 ? (leisureTime / totalTime) * 100 : 0;
  const exercisePercentage = totalTime > 0 ? (exerciseTime / totalTime) * 100 : 0;
  
  let balanceScore = 10;
  
  if (workPercentage < 40) balanceScore -= Math.floor((40 - workPercentage) / 5);
  if (workPercentage > 50) balanceScore -= Math.floor((workPercentage - 50) / 5);
  if (leisurePercentage < 15) balanceScore -= Math.floor((15 - leisurePercentage) / 5);
  if (leisurePercentage > 25) balanceScore -= Math.floor((leisurePercentage - 25) / 5);
  if (exercisePercentage < 8) balanceScore -= Math.floor((8 - exercisePercentage) / 5);
  
  balanceScore = Math.max(0, balanceScore);

  const baseScore = 0;
  const bonusPoints = 0;
  const penalties = 0;
  const finalScore = 0;

  return {
    taskScore,
    aiProductivityScore,
    focusScore,
    balanceScore,
    baseScore,
    bonusPoints,
    penalties,
    finalScore,
    averageProductivity,
    focusTime,
    completedTasks,
    totalTasks
  };
};
