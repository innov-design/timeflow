
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
  habitScore: number;
  activityScore: number;
  focusScore: number;
  bonusScore: number;
  streakMultiplier: number;
  penalties: number;
  baseScore: number;
  finalScore: number;
  breakdown: {
    tasks: { completed: number; total: number };
    habits: { completed: number; total: number };
    activities: { total: number; totalTime: number };
    focus: { time: number; activities: number };
    bonus: { pomodoro: number; focusMode: number };
  };
}

export const calculateProductivityScore = (
  activities: any[],
  todos: any[],
  habits: any[],
  pomodoroCount: number,
  focusModeCount: number,
  streak: number
) => {
  // Task Completion Score (0-25 points)
  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  const taskScore = totalTodos > 0 ? Math.min((completedTodos / totalTodos) * 25, 25) : 0;

  // Habit Completion Score (0-20 points)
  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;
  const habitScore = totalHabits > 0 ? Math.min((completedHabits / totalHabits) * 20, 20) : 0;

  // Activity Quality Score (0-30 points)
  const today = new Date().toDateString();
  const todayActivities = activities.filter(activity => 
    new Date(activity.startTime).toDateString() === today
  );

  const totalTimeToday = todayActivities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
  const categoryDistribution = todayActivities.reduce((acc, activity) => {
    const category = activity.category || 'Other';
    acc[category] = (acc[category] || 0) + (activity.duration || 0);
    return acc;
  }, {} as Record<string, number>);

  // Calculate weighted activity score
  let weightedScore = 0;
  Object.entries(categoryDistribution).forEach(([category, duration]) => {
    const weight = getCategoryWeight(category);
    const typedDuration = Number(duration);
    weightedScore += typedDuration * weight;
  });

  const activityScore = totalTimeToday > 0 ? Math.min((weightedScore / totalTimeToday) * 30, 30) : 0;

  // Focus Time Score (0-15 points)
  const focusActivities = ['Work', 'Study', 'Learning', 'Deep Work'];
  const focusTime = Object.entries(categoryDistribution)
    .filter(([category]) => focusActivities.includes(category))
    .reduce((sum, [, duration]) => {
      const typedDuration = Number(duration);
      return sum + typedDuration;
    }, 0);

  const focusScore = Math.min((focusTime / 3600) * 15, 15); // 1 hour = max points

  // Bonus Points (0-10 points)
  const pomodoroBonus = Math.min(pomodoroCount * 2, 6);
  const focusModeBonus = Math.min(focusModeCount * 1, 4);
  const bonusScore = pomodoroBonus + focusModeBonus;

  // Calculate base score
  const baseScore = taskScore + habitScore + activityScore + focusScore + bonusScore;

  // Streak multiplier (1.0 to 1.1)
  const streakMultiplier = Math.min(1 + (streak * 0.01), 1.1);

  // Penalties
  let penalties = 0;
  
  // Productivity category distribution analysis
  const productiveTime = (Number(categoryDistribution['Work']) || 0) + 
                         (Number(categoryDistribution['Study']) || 0) + 
                         (Number(categoryDistribution['Learning']) || 0);
  const leisureTime = (Number(categoryDistribution['Entertainment']) || 0) + 
                     (Number(categoryDistribution['Gaming']) || 0) + 
                     (Number(categoryDistribution['Social Media']) || 0);

  // Apply penalties for poor time distribution
  if (leisureTime > 0 && productiveTime > 0) {
    const leisureRatio = leisureTime / totalTimeToday;
    if (leisureRatio > 0.5) penalties += 10; // Too much leisure time
  }

  // Final score calculation
  const finalScore = Math.max(Math.min(baseScore * streakMultiplier - penalties, 100), 0);

  return {
    finalScore,
    taskScore,
    habitScore,
    activityScore,
    focusScore,
    bonusScore,
    streakMultiplier,
    penalties,
    baseScore,
    breakdown: {
      tasks: { completed: completedTodos, total: totalTodos },
      habits: { completed: completedHabits, total: totalHabits },
      activities: { total: todayActivities.length, totalTime: totalTimeToday },
      focus: { time: focusTime, activities: focusActivities.length },
      bonus: { pomodoro: pomodoroCount, focusMode: focusModeCount }
    }
  };
};

export const getCategoryWeight = (category: string): number => {
  switch (category) {
    case 'Work':
    case 'Study':
    case 'Learning':
      return 1.5;
    case 'Exercise':
    case 'Fitness':
      return 1.2;
    case 'Leisure':
    case 'Entertainment':
    case 'Gaming':
    case 'Social Media':
      return 0.8;
    case 'Personal':
      return 0.5;
    default:
      return 1;
  }
};
