
export type Category = '一般常識' | '歴史' | '科学' | '言語' | '数学' | 'IT・技術' | '政治・経済';

export interface Question {
  id: number;
  category: Category;
  question: string;
  answer: string;
  explanation?: string;
}

export enum QuizMode {
  IDLE = 'IDLE',
  ALL = 'ALL',
  RANDOM10 = 'RANDOM10',
  LIST = 'LIST'
}

export interface QuizState {
  currentMode: QuizMode;
  questions: Question[];
  currentIndex: number;
  showAnswer: boolean;
  history: { questionId: number; isCorrect: boolean }[];
}
