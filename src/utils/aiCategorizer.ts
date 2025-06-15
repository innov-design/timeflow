
export const categorizeActivity = (activityName: string): string[] => {
  const activity = activityName.toLowerCase();
  const categories: string[] = [];
  
  // Technical Education
  if (activity.includes('codecademy') || activity.includes('coding course') || 
      activity.includes('coding project') || activity.includes('react') || 
      activity.includes('javascript') || activity.includes('coding') ||
      activity.includes('robotics') || activity.includes('arduino') || 
      activity.includes('programming') || activity.includes('tutorial') ||
      activity.includes('class') || activity.includes('lecture') || activity.includes('workshop')) {
    categories.push('Technical Education');
  }
  
  // Learning & Skills - NEW CATEGORY
  if (activity.includes('learning') || activity.includes('language') || 
      activity.includes('math') || activity.includes('violin') || 
      activity.includes('piano') || activity.includes('music practice') ||
      activity.includes('skill building') || activity.includes('practicing') ||
      activity.includes('study') || activity.includes('learn') || 
      activity.includes('course') || activity.includes('read') || 
      activity.includes('research') || activity.includes('practice') || 
      activity.includes('training') || activity.includes('skill') ||
      activity.includes('book') || activity.includes('homework') || 
      activity.includes('exam') || activity.includes('spanish') ||
      activity.includes('french') || activity.includes('german') ||
      activity.includes('chinese') || activity.includes('japanese') ||
      activity.includes('duolingo') || activity.includes('language learning')) {
    categories.push('Learning & Skills');
  }
  
  // Business - NEW CATEGORY
  if (activity.includes('dropshipping') || activity.includes('saas') || 
      activity.includes('affiliate marketing') || activity.includes('business') ||
      activity.includes('entrepreneurship') || activity.includes('startup') ||
      activity.includes('marketing') || activity.includes('sales') ||
      activity.includes('money making') || activity.includes('investing') ||
      activity.includes('trading') || activity.includes('freelancing') ||
      activity.includes('consulting') || activity.includes('e-commerce') ||
      activity.includes('online business') || activity.includes('side hustle') ||
      activity.includes('passive income') || activity.includes('networking') ||
      activity.includes('client work') || activity.includes('proposal') ||
      activity.includes('business plan') || activity.includes('market research')) {
    categories.push('Business');
  }
  
  // Leisure
  if (activity.includes('cricket') && activity.includes('house') ||
      activity.includes('chilling') || activity.includes('break') ||
      activity.includes('rest') || activity.includes('relax') ||
      activity.includes('entertainment') || activity.includes('game') || 
      activity.includes('tv') || activity.includes('movie') || 
      activity.includes('music') || activity.includes('social media') ||
      activity.includes('leisure') || activity.includes('free time')) {
    categories.push('Leisure');
  }
  
  // Fitness
  if (activity.includes('tennis') || activity.includes('walking') || 
      activity.includes('table tennis') || activity.includes('cricket') ||
      activity.includes('scooter') || activity.includes('playing with friends') ||
      activity.includes('exercise') || activity.includes('workout') || 
      activity.includes('gym') || activity.includes('run') || 
      activity.includes('yoga') || activity.includes('sport') || 
      activity.includes('fitness') || activity.includes('health') ||
      activity.includes('bike') || activity.includes('swim') || 
      activity.includes('dance') || activity.includes('hike') || 
      activity.includes('stretch') || activity.includes('cardio')) {
    categories.push('Fitness');
  }
  
  // Eating
  if (activity.includes('eat') || activity.includes('meal') || 
      activity.includes('breakfast') || activity.includes('lunch') || 
      activity.includes('dinner') || activity.includes('supper') || 
      activity.includes('snack') || activity.includes('cook') || 
      activity.includes('food') || activity.includes('restaurant') ||
      activity.includes('kitchen') || activity.includes('recipe') || 
      activity.includes('grocery')) {
    categories.push('Eating');
  }
  
  // Time with Family
  if (activity.includes('family') || activity.includes('parent') || 
      activity.includes('child') || activity.includes('sibling') || 
      activity.includes('mom') || activity.includes('dad') ||
      activity.includes('mother') || activity.includes('father') || 
      activity.includes('kids') || activity.includes('relatives') || 
      activity.includes('together') || activity.includes('visit') ||
      (activity.includes('walking') && activity.includes('family')) ||
      (activity.includes('tennis') && activity.includes('family')) ||
      (activity.includes('tv') && activity.includes('family')) ||
      (activity.includes('games') && activity.includes('family'))) {
    categories.push('Time with Family');
  }
  
  // Default category if none match
  if (categories.length === 0) {
    categories.push('Other');
  }
  
  return categories;
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Technical Education': return '#3B82F6'; // Blue
    case 'Learning & Skills': return '#10B981'; // Green
    case 'Business': return '#F59E0B'; // Orange
    case 'Fitness': return '#EF4444'; // Red
    case 'Leisure': return '#8B5CF6'; // Purple
    case 'Eating': return '#F97316'; // Orange
    case 'Time with Family': return '#EC4899'; // Pink
    default: return '#6B7280'; // Gray
  }
};

export const getCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'Technical Education': return '💻';
    case 'Learning & Skills': return '📚';
    case 'Business': return '💼';
    case 'Fitness': return '💪';
    case 'Leisure': return '😌';
    case 'Eating': return '🍽️';
    case 'Time with Family': return '👨‍👩‍👧‍👦';
    default: return '📝';
  }
};
