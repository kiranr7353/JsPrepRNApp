export type DevicePlatform = 'ios' | 'android' | 'responsive';

export type MainTab = 'home' | 'qa' | 'programming' | 'snippets' | 'bookmarks' | 'export';

export interface Category {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge: string;
  color: string;
  totalQuestions: number;
  totalSnippets: number;
  topics: Topic[];
}

export interface Topic {
  id: string;
  backendTopicId?: string;
  categoryId?: string;
  displayOrder?: number;
  title: string;
  summary: string;
  imageUrl?: string;
  enabled?: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  subtopics: string[];
  keyPoints?: string[];
  codeExample?: string;
  detailedNotes?: string;
  interviewTips?: string[];
}

export interface QuestionAnswer {
  id: string;
  categoryId: string;
  topicId?: string;
  categoryName: string;
  question: string;
  answer: string;
  codeSnippet?: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  explanationPoints?: string[];
  isBookmarked?: boolean;
  snippets?: { url?: string; imageUploaded?: boolean }[];
  pointsData?: { pointHeader?: string; value?: string; code?: string }[];
}

export interface ProgrammingQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  starterCode: string;
  solutionCode: string;
  testCases: { input: string; expected: string }[];
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  isBookmarked?: boolean;
  snippets?: { url?: string; imageUploaded?: boolean }[];
}

export interface CodeSnippet {
  id: string;
  title: string;
  category: string;
  language: string;
  code: string;
  description: string;
  tags: string[];
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isGuest: boolean;
  bookmarkedQAIds: string[];
  bookmarkedPQAIds: string[];
  completedQuestions: string[];
}
