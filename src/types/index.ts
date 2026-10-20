/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'left-thumb'
  | 'right-thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyDefinition {
  code: string;
  char: string;
  shiftChar?: string;
  finger: FingerId;
  row: number; // 0: numbers, 1: top, 2: home, 3: bottom, 4: space
  width?: string; // flex/width sizing for special keys
  isHomeKey?: boolean;
  hasTactileBump?: boolean;
  label?: string;
  shiftLabel?: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type LessonCategory = 
  | 'home-row'
  | 'top-row'
  | 'bottom-row'
  | 'numbers'
  | 'symbols'
  | 'muscle-memory'
  | 'vietnamese-words'
  | 'english-words'
  | 'paragraphs';

export interface Lesson {
  id: string;
  number: number;
  chapter: string;
  title: string;
  description: string;
  category: LessonCategory;
  difficulty: DifficultyLevel;
  targetKeys: string[];
  focusFingers: FingerId[];
  text: string;
  instructionTip: string;
}

export interface SpeedTestPrompt {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  language: 'vi' | 'en';
  category: string;
  text: string;
}

export interface TestResultRecord {
  id: string;
  timestamp: number;
  mode: 'lesson' | 'speed-test' | 'reflex' | 'custom';
  title: string;
  durationSeconds: number;
  wpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number;
  totalChars: number;
  errorChars: number;
  xpEarned: number;
  mistakesByKey: Record<string, number>;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: 'speed' | 'accuracy' | 'streak' | 'practice' | 'mastery';
  unlockedAt?: number;
  progress?: number;
  maxProgress: number;
}

export interface UserStats {
  xp: number;
  level: number;
  totalPracticeTimeSecs: number;
  totalCharactersTyped: number;
  completedLessons: Record<string, { bestWpm: number; bestAccuracy: number; stars: number; timestamp: number }>;
  testHistory: TestResultRecord[];
  problemKeys: Record<string, number>;
  unlockedBadges: string[];
  currentStreakDays: number;
  lastPracticeDate: string;
}

export type SoundSwitchType = 'blue' | 'brown' | 'bubble' | 'off';
