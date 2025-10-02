import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, WeekPlan, DailyPlan } from '../types';

interface TodoState {
  todos: Todo[];
  currentWeekPlan?: WeekPlan;
  loading: boolean;
}

type TodoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_WEEK_PLAN'; payload: WeekPlan };

const initialState: TodoState = {
  todos: [],
  currentWeekPlan: undefined,
  loading: false,
};

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'SET_WEEK_PLAN':
      return { ...state, currentWeekPlan: action.payload };
    default:
      return state;
  }
};

interface TodoContextType {
  state: TodoState;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  generateWeekPlan: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [state.todos]);

  const loadTodos = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) {
        const todos = JSON.parse(storedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
        dispatch({ type: 'SET_TODOS', payload: todos });
      }
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(state.todos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  };

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TODO', payload: newTodo });
  };

  const updateTodo = (todo: Todo) => {
    const updatedTodo = { ...todo, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_TODO', payload: updatedTodo });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const generateWeekPlan = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const dailyPlans: DailyPlan[] = [];
    const incompleteTodos = state.todos.filter(todo => !todo.completed);

    // Generate 7 daily plans
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const bigTasks = incompleteTodos.filter(todo => todo.category === 'big');
      const mediumTasks = incompleteTodos.filter(todo => todo.category === 'medium');
      const smallTasks = incompleteTodos.filter(todo => todo.category === 'small');

      const dailyPlan: DailyPlan = {
        date,
        bigTask: bigTasks[i % bigTasks.length] || undefined,
        mediumTasks: mediumTasks.slice(i * 3, (i + 1) * 3),
        smallTasks: smallTasks.slice(i * 5, (i + 1) * 5),
        completed: false,
      };

      dailyPlans.push(dailyPlan);
    }

    const weekPlan: WeekPlan = {
      id: `week-${startOfWeek.toISOString()}`,
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      todos: state.todos,
      dailyPlans,
    };

    dispatch({ type: 'SET_WEEK_PLAN', payload: weekPlan });
  };

  return (
    <TodoContext.Provider
      value={{
        state,
        addTodo,
        updateTodo,
        deleteTodo,
        generateWeekPlan,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};