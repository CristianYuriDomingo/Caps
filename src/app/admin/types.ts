// app/admin/types.ts
export interface Module {
  id: string;
  title: string;
  image: string;
  lessonCount: number;
  status: 'active' | 'inactive';
}

export interface Tip {
  id: string;
  title: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  bubbleSpeech: string;
  timer: number;
  tips: Tip[];
}

export interface Stats {
  totalUsers: number;
  totalModules: number;
  totalLessons: number;
  totalTips: number;
  activeUsers: number;
  completedLessons: number;
  averageScore: number;
  newUsersThisWeek: number;
}

export interface RecentActivity {
  id: string;
  type: 'user_registered' | 'lesson_completed' | 'module_created' | 'quiz_submitted';
  description: string;
  timestamp: string;
  user?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  completedLessons: number;
  totalScore: number;
}