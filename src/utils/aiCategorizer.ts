
export const categorizeActivity = (activityName: string): string => {
  const activity = activityName.toLowerCase();
  
  // Work & Professional
  if (activity.includes('meeting') || activity.includes('work') || activity.includes('project') || 
      activity.includes('email') || activity.includes('call') || activity.includes('presentation') ||
      activity.includes('coding') || activity.includes('development') || activity.includes('office')) {
    return 'Work & Professional';
  }
  
  // Learning & Education
  if (activity.includes('study') || activity.includes('learn') || activity.includes('course') ||
      activity.includes('read') || activity.includes('research') || activity.includes('tutorial') ||
      activity.includes('practice') || activity.includes('training') || activity.includes('skill')) {
    return 'Learning & Education';
  }
  
  // Health & Fitness
  if (activity.includes('exercise') || activity.includes('workout') || activity.includes('gym') ||
      activity.includes('run') || activity.includes('walk') || activity.includes('yoga') ||
      activity.includes('sport') || activity.includes('fitness') || activity.includes('health')) {
    return 'Health & Fitness';
  }
  
  // Creative & Hobbies
  if (activity.includes('draw') || activity.includes('paint') || activity.includes('music') ||
      activity.includes('write') || activity.includes('creative') || activity.includes('art') ||
      activity.includes('hobby') || activity.includes('craft') || activity.includes('design')) {
    return 'Creative & Hobbies';
  }
  
  // Personal & Life
  if (activity.includes('clean') || activity.includes('cook') || activity.includes('shop') ||
      activity.includes('personal') || activity.includes('family') || activity.includes('friend') ||
      activity.includes('social') || activity.includes('chore') || activity.includes('home')) {
    return 'Personal & Life';
  }
  
  // Entertainment
  if (activity.includes('watch') || activity.includes('movie') || activity.includes('game') ||
      activity.includes('tv') || activity.includes('entertainment') || activity.includes('fun') ||
      activity.includes('relax') || activity.includes('browse') || activity.includes('social media')) {
    return 'Entertainment';
  }
  
  // Transport & Travel
  if (activity.includes('drive') || activity.includes('travel') || activity.includes('commute') ||
      activity.includes('transport') || activity.includes('trip') || activity.includes('journey')) {
    return 'Transport & Travel';
  }
  
  // Default category
  return 'Other';
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Work & Professional': return '#3B82F6'; // Blue
    case 'Learning & Education': return '#10B981'; // Green
    case 'Health & Fitness': return '#F59E0B'; // Orange
    case 'Creative & Hobbies': return '#8B5CF6'; // Purple
    case 'Personal & Life': return '#EF4444'; // Red
    case 'Entertainment': return '#EC4899'; // Pink
    case 'Transport & Travel': return '#06B6D4'; // Cyan
    default: return '#6B7280'; // Gray
  }
};

export const getCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'Work & Professional': return '💼';
    case 'Learning & Education': return '📚';
    case 'Health & Fitness': return '💪';
    case 'Creative & Hobbies': return '🎨';
    case 'Personal & Life': return '🏠';
    case 'Entertainment': return '🎬';
    case 'Transport & Travel': return '🚗';
    default: return '📝';
  }
};
