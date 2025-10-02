export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'small' | 'medium' | 'big'; // For 1-3-5 rule
  status: 'todo' | 'in-progress' | 'done'; // For Kanban
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  urgent: boolean;
  important: boolean;
}

export interface WeekPlan {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  todos: Todo[];
  dailyPlans: DailyPlan[];
}

export interface DailyPlan {
  date: Date;
  bigTask?: Todo;
  mediumTasks: Todo[];
  smallTasks: Todo[];
  completed: boolean;
}

export type ViewType = 'list' | 'kanban' | 'matrix' | 'rule135';

export type Priority = 'low' | 'medium' | 'high';
export type TaskCategory = 'small' | 'medium' | 'big';
export type TaskStatus = 'todo' | 'in-progress' | 'done';