
export interface HealthCounters {
  water: number; // glasses
  meals: number; // meals eaten
  fruitsVeggies: number; // servings
}

export interface HealthScoreData {
  counters: HealthCounters;
  fitnessTime: number; // in seconds
  healthScore: number;
  breakdown: {
    waterScore: number;
    mealScore: number;
    fruitsVeggiesScore: number;
    fitnessScore: number;
  };
}

export const calculateHealthScore = (
  counters: HealthCounters,
  activities: any[]
): HealthScoreData => {
  // Calculate fitness time from activities
  const today = new Date().toDateString();
  const todayActivities = activities.filter(activity => 
    new Date(activity.startTime).toDateString() === today
  );

  const fitnessTime = todayActivities
    .filter(activity => activity.category === 'Fitness')
    .reduce((sum, activity) => sum + (activity.duration || 0), 0);

  // Water score (0-25 points) - 8 glasses is ideal
  const waterScore = Math.min((counters.water / 8) * 25, 25);

  // Meal score (0-25 points) - 3 meals is ideal
  const mealScore = Math.min((counters.meals / 3) * 25, 25);

  // Fruits & Veggies score (0-25 points) - 5 servings is ideal
  const fruitsVeggiesScore = Math.min((counters.fruitsVeggies / 5) * 25, 25);

  // Fitness score (0-25 points) - 30 minutes is ideal
  const idealFitnessTime = 30 * 60; // 30 minutes in seconds
  const fitnessScore = Math.min((fitnessTime / idealFitnessTime) * 25, 25);

  // Calculate total health score
  const healthScore = waterScore + mealScore + fruitsVeggiesScore + fitnessScore;

  return {
    counters,
    fitnessTime,
    healthScore: Math.round(healthScore),
    breakdown: {
      waterScore: Math.round(waterScore),
      mealScore: Math.round(mealScore),
      fruitsVeggiesScore: Math.round(fruitsVeggiesScore),
      fitnessScore: Math.round(fitnessScore)
    }
  };
};

export const getHealthScoreColor = (score: number): string => {
  if (score >= 90) return 'text-green-400';
  if (score >= 75) return 'text-blue-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 45) return 'text-orange-400';
  return 'text-red-400';
};

export const getHealthScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent Health';
  if (score >= 75) return 'Good Health';
  if (score >= 60) return 'Fair Health';
  if (score >= 45) return 'Needs Improvement';
  return 'Poor Health';
};
