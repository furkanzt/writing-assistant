export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface Rubric {
  id: string;
  name: string;
  criteria: RubricCriterion[];
}

export interface CriterionFeedback {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
  feedback: string;
  aiFeedback: string;
  chatHistory: ChatMessage[];
  todoItems: TodoItem[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reactions: MessageReaction[];
}

export interface MessageReaction {
  type: 'like' | 'dislike';
  userId: string;
  timestamp: Date;
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  criterionId: string;
  createdAt: Date;
  completedAt?: Date;
  studentNotes?: string;
}

export interface EssayAnalysis {
  id: string;
  essay: string;
  examType: string;
  title?: string;
  topic?: string;
  timestamp: Date;
  overallScore: number;
  maxScore: number;
  criterionFeedbacks: CriterionFeedback[];
  generalFeedback: string;
  todoList: TodoItem[];
  editingHistory: EditingSession[];
}

export interface EditingSession {
  id: string;
  originalText: string;
  editedText: string;
  changes: TextChange[];
  timestamp: Date;
  criterionId?: string;
  todoItemId?: string;
  aiEvaluation?: AIEvaluation;
}

export interface TextChange {
  type: 'addition' | 'deletion' | 'modification';
  position: number;
  oldText?: string;
  newText?: string;
  timestamp: Date;
}

export interface AIEvaluation {
  improvementScore: number;
  feedback: string;
  suggestions: string[];
  addressedCriteria: string[];
  chatHistory: ChatMessage[];
}

export interface WritingBehavior {
  timestamp: Date;
  keypressCount: number;
  backspaceCount: number;
  linesAdded: number;
  linesRemoved: number;
  sessionDuration: number;
}

export interface ExamType {
  id: string;
  name: string;
  rubric: Rubric;
  description: string;
} 