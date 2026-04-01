export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: string;
  category: 'child' | 'parent' | 'both';
  checkFn: (stats: GamificationStats) => boolean;
}

export interface AvatarDefinition {
  id: string;
  name: string;
  emoji: string;
  xpRequired: number;
}

export interface GamificationStats {
  totalXP: number;
  totalCompletions: number;
  uniqueActivities: number;
  currentStreak: number;
  longestStreak: number;
  journalEntries: number;
  moodEntries: number;
  badgeCount: number;
}

export const XP_RULES: Record<string, number> = {
  activity_completion: 50,
  journal_entry: 30,
  quiz_completion: 40,
  mood_check: 10,
  streak_bonus: 20,
  role_play: 45,
  guide_read: 25,
  article_read: 20,
};

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];

export const getLevel = (xp: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

export const getXPForNextLevel = (xp: number): { current: number; needed: number; progress: number } => {
  const level = getLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 2000;
  const current = xp - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  return { current, needed, progress: Math.min((current / needed) * 100, 100) };
};

export const BADGES: BadgeDefinition[] = [
  // Child badges
  { id: 'creative-star', name: 'Creative Star', description: 'Complete your first drawing activity', emoji: '🌟', requirement: 'Complete 1 activity', category: 'child', checkFn: (s) => s.totalCompletions >= 1 },
  { id: 'emotion-explorer', name: 'Emotion Explorer', description: 'Try 3 different types of activities', emoji: '🧭', requirement: 'Try 3 activity types', category: 'child', checkFn: (s) => s.uniqueActivities >= 3 },
  { id: 'zen-master', name: 'Zen Master', description: 'Complete 5 breathing exercises', emoji: '🧘', requirement: 'Complete 5 activities', category: 'child', checkFn: (s) => s.totalCompletions >= 5 },
  { id: 'story-hero', name: 'Story Hero', description: 'Complete 10 activities', emoji: '📖', requirement: 'Complete 10 activities', category: 'child', checkFn: (s) => s.totalCompletions >= 10 },
  { id: 'streak-flame', name: '7-Day Streak', description: 'Keep a 7-day activity streak', emoji: '🔥', requirement: '7-day streak', category: 'both', checkFn: (s) => s.currentStreak >= 7 },
  { id: 'mood-tracker', name: 'Mood Tracker', description: 'Log your mood 10 times', emoji: '🎭', requirement: 'Log 10 moods', category: 'child', checkFn: (s) => s.moodEntries >= 10 },
  { id: 'super-achiever', name: 'Super Achiever', description: 'Complete 25 activities', emoji: '🏆', requirement: 'Complete 25 activities', category: 'child', checkFn: (s) => s.totalCompletions >= 25 },
  { id: 'xp-hunter', name: 'XP Hunter', description: 'Earn 500 XP points', emoji: '💎', requirement: 'Earn 500 XP', category: 'both', checkFn: (s) => s.totalXP >= 500 },
  
  // Parent badges
  { id: 'reflective-parent', name: 'Reflective Parent', description: 'Write 3 journal entries', emoji: '📝', requirement: 'Write 3 journal entries', category: 'parent', checkFn: (s) => s.journalEntries >= 3 },
  { id: 'guide-reader', name: 'Guide Reader', description: 'Complete 5 activities', emoji: '📚', requirement: 'Complete 5 activities', category: 'parent', checkFn: (s) => s.totalCompletions >= 5 },
  { id: 'role-play-pro', name: 'Role Play Pro', description: 'Complete 10 activities', emoji: '🎬', requirement: 'Complete 10 activities', category: 'parent', checkFn: (s) => s.totalCompletions >= 10 },
  { id: 'quiz-champion', name: 'Quiz Champion', description: 'Earn 300 XP', emoji: '🧠', requirement: 'Earn 300 XP', category: 'parent', checkFn: (s) => s.totalXP >= 300 },
  { id: 'dedicated-parent', name: 'Dedicated Parent', description: 'Maintain a 14-day streak', emoji: '❤️', requirement: '14-day streak', category: 'parent', checkFn: (s) => s.currentStreak >= 14 },
  { id: 'master-parent', name: 'Master Parent', description: 'Earn 1000 XP', emoji: '👑', requirement: 'Earn 1000 XP', category: 'parent', checkFn: (s) => s.totalXP >= 1000 },
  { id: 'legend', name: 'Legend', description: 'Earn 2000 XP and complete 50 activities', emoji: '🌈', requirement: 'Earn 2000 XP & 50 activities', category: 'both', checkFn: (s) => s.totalXP >= 2000 && s.totalCompletions >= 50 },
];

export const UNLOCKABLE_AVATARS: AvatarDefinition[] = [
  { id: 'avatar-star', name: 'Star Kid', emoji: '⭐', xpRequired: 0 },
  { id: 'avatar-rocket', name: 'Rocket Explorer', emoji: '🚀', xpRequired: 100 },
  { id: 'avatar-unicorn', name: 'Unicorn Dreamer', emoji: '🦄', xpRequired: 250 },
  { id: 'avatar-dragon', name: 'Friendly Dragon', emoji: '🐉', xpRequired: 500 },
  { id: 'avatar-wizard', name: 'Wise Wizard', emoji: '🧙', xpRequired: 750 },
  { id: 'avatar-superhero', name: 'Super Hero', emoji: '🦸', xpRequired: 1000 },
  { id: 'avatar-phoenix', name: 'Phoenix Rising', emoji: '🔥', xpRequired: 1500 },
  { id: 'avatar-crown', name: 'Royal Crown', emoji: '👑', xpRequired: 2000 },
  { id: 'avatar-galaxy', name: 'Galaxy Guardian', emoji: '🌌', xpRequired: 3000 },
  { id: 'avatar-rainbow', name: 'Rainbow Legend', emoji: '🌈', xpRequired: 5000 },
];
