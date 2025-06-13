
export const categorizeActivity = (activityName: string): string => {
  const activity = activityName.toLowerCase();
  
  // Learning and Education
  if (activity.includes('study') || activity.includes('learn') || activity.includes('course') ||
      activity.includes('read') || activity.includes('research') || activity.includes('tutorial') ||
      activity.includes('practice') || activity.includes('training') || activity.includes('skill') ||
      activity.includes('book') || activity.includes('homework') || activity.includes('exam') ||
      activity.includes('class') || activity.includes('lecture') || activity.includes('workshop')) {
    return 'Learning and Education';
  }
  
  // Physical Activity
  if (activity.includes('exercise') || activity.includes('workout') || activity.includes('gym') ||
      activity.includes('run') || activity.includes('walk') || activity.includes('yoga') ||
      activity.includes('sport') || activity.includes('fitness') || activity.includes('health') ||
      activity.includes('bike') || activity.includes('swim') || activity.includes('dance') ||
      activity.includes('hike') || activity.includes('stretch') || activity.includes('cardio')) {
    return 'Physical Activity';
  }
  
  // Eating
  if (activity.includes('eat') || activity.includes('meal') || activity.includes('breakfast') ||
      activity.includes('lunch') || activity.includes('dinner') || activity.includes('snack') ||
      activity.includes('cook') || activity.includes('food') || activity.includes('restaurant') ||
      activity.includes('kitchen') || activity.includes('recipe') || activity.includes('grocery')) {
    return 'Eating';
  }
  
  // Time with Family
  if (activity.includes('family') || activity.includes('parent') || activity.includes('child') ||
      activity.includes('sibling') || activity.includes('mom') || activity.includes('dad') ||
      activity.includes('mother') || activity.includes('father') || activity.includes('kids') ||
      activity.includes('relatives') || activity.includes('together') || activity.includes('visit')) {
    return 'Time with Family';
  }
  
  // Break Time
  if (activity.includes('break') || activity.includes('rest') || activity.includes('relax') ||
      activity.includes('nap') || activity.includes('sleep') || activity.includes('chill') ||
      activity.includes('leisure') || activity.includes('free time') || activity.includes('pause') ||
      activity.includes('entertainment') || activity.includes('game') || activity.includes('tv') ||
      activity.includes('movie') || activity.includes('music') || activity.includes('social media')) {
    return 'Break Time';
  }
  
  // Default category
  return 'Other';
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Learning and Education': return '#3B82F6'; // Blue
    case 'Physical Activity': return '#10B981'; // Green
    case 'Eating': return '#F59E0B'; // Orange
    case 'Time with Family': return '#EF4444'; // Red
    case 'Break Time': return '#8B5CF6'; // Purple
    default: return '#6B7280'; // Gray
  }
};

export const getCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'Learning and Education': return '📚';
    case 'Physical Activity': return '💪';
    case 'Eating': return '🍽️';
    case 'Time with Family': return '👨‍👩‍👧‍👦';
    case 'Break Time': return '😌';
    default: return '📝';
  }
};
