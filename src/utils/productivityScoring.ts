
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

// Category productivity weights for scoring
export const getCategoryProductivityWeight = (category: string): number => {
  switch (category) {
    case 'Technical Education': return 1.0; // Highest productivity
    case 'Learning & Skills': return 0.9;
    case 'Business': return 0.85;
    case 'Fitness': return 0.7;
    case 'Time with Family': return 0.6;
    case 'Eating': return 0.5;
    case 'Browsing': return 0.3;
    case 'Leisure': return 0.2; // Lowest productivity
    default: return 0.4;
  }
};

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

  // Activity Quality Score (0-40 points) - ENHANCED with category-based scoring
  const today = new Date().toDateString();
  const todayActivities = activities.filter(activity => 
    new Date(activity.startTime).toDateString() === today
  );

  const totalTimeToday = todayActivities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
  
  // Calculate category-based productivity score
  let categoryScore = 0;
  const categoryTotals: Record<string, number> = {};
  
  todayActivities.forEach(activity => {
    const category = activity.category || 'Other';
    const duration = activity.duration || 0;
    categoryTotals[category] = (categoryTotals[category] || 0) + duration;
  });

  // Calculate weighted score based on time spent in each category
  Object.entries(categoryTotals).forEach(([category, duration]) => {
    const weight = getCategoryProductivityWeight(category);
    const timePercentage = totalTimeToday > 0 ? duration / totalTimeToday : 0;
    categoryScore += timePercentage * weight * 40; // Scale to 40 points max
  });

  const activityScore = Math.min(categoryScore, 40);

  // Focus Time Score (0-10 points) - reduced since category scoring covers this
  const focusCategories = ['Technical Education', 'Learning & Skills', 'Business'];
  const focusTime = Object.entries(categoryTotals)
    .filter(([category]) => focusCategories.includes(category))
    .reduce((sum, [, duration]) => sum + duration, 0);

  const focusScore = Math.min((focusTime / 3600) * 10, 10); // 1 hour = max points

  // Bonus Points (0-5 points)
  const pomodoroBonus = Math.min(pomodoroCount * 1, 3);
  const focusModeBonus = Math.min(focusModeCount * 1, 2);
  const bonusScore = pomodoroBonus + focusModeBonus;

  // Calculate base score
  const baseScore = taskScore + habitScore + activityScore + focusScore + bonusScore;

  // Streak multiplier (1.0 to 1.1)
  const streakMultiplier = Math.min(1 + (streak * 0.01), 1.1);

  // Penalties for poor time distribution
  let penalties = 0;
  const leisureTime = categoryTotals['Leisure'] || 0;
  const browsingTime = categoryTotals['Browsing'] || 0;
  const unproductiveTime = leisureTime + browsingTime;
  
  if (totalTimeToday > 0) {
    const unproductiveRatio = unproductiveTime / totalTimeToday;
    if (unproductiveRatio > 0.6) penalties += 15; // Too much unproductive time
    else if (unproductiveRatio > 0.4) penalties += 8;
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
      focus: { time: focusTime, activities: focusCategories.length },
      bonus: { pomodoro: pomodoroCount, focusMode: focusModeCount }
    }
  };
};

export const getCategoryWeight = (category: string): number => {
  return getCategoryProductivityWeight(category);
};
