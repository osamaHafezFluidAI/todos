import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTodos } from '../contexts/TodoContext';
import TodoItem from '../components/TodoItem';
import { Todo, DailyPlan } from '../types';

const Rule135Screen: React.FC = () => {
  const { state, updateTodo, deleteTodo, generateWeekPlan } = useTodos();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

  useEffect(() => {
    generateCurrentWeek();
    if (!state.currentWeekPlan) {
      generateWeekPlan();
    }
  }, []);

  const generateCurrentWeek = () => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    setCurrentWeek(week);
  };

  const getTodaysPlan = (): DailyPlan | undefined => {
    if (!state.currentWeekPlan) return undefined;
    
    return state.currentWeekPlan.dailyPlans.find(plan => 
      plan.date.toDateString() === selectedDate.toDateString()
    );
  };

  const getAvailableTasksByCategory = (category: 'big' | 'medium' | 'small') => {
    return state.todos.filter(todo => 
      !todo.completed && 
      todo.category === category &&
      !isTaskAssignedToday(todo)
    );
  };

  const isTaskAssignedToday = (todo: Todo): boolean => {
    const todaysPlan = getTodaysPlan();
    if (!todaysPlan) return false;

    return (
      todaysPlan.bigTask?.id === todo.id ||
      todaysPlan.mediumTasks.some(t => t.id === todo.id) ||
      todaysPlan.smallTasks.some(t => t.id === todo.id)
    );
  };

  const assignTask = (todo: Todo, category: 'big' | 'medium' | 'small') => {
    // This would update the week plan
    // For now, we'll just update the todo status
    updateTodo({ ...todo, status: 'in-progress' });
  };

  const removeTaskFromPlan = (todo: Todo) => {
    updateTodo({ ...todo, status: 'todo' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const getTodaysProgress = () => {
    const todaysPlan = getTodaysPlan();
    if (!todaysPlan) {
      return { 
        completed: 0, 
        total: 0,
        big: { completed: 0, total: 0 },
        medium: { completed: 0, total: 0 },
        small: { completed: 0, total: 0 },
      };
    }

    const bigCompleted = todaysPlan.bigTask?.completed ? 1 : 0;
    const mediumCompleted = todaysPlan.mediumTasks?.filter(t => t.completed).length || 0;
    const smallCompleted = todaysPlan.smallTasks?.filter(t => t.completed).length || 0;
    
    const bigTotal = todaysPlan.bigTask ? 1 : 0;
    const mediumTotal = todaysPlan.mediumTasks?.length || 0;
    const smallTotal = todaysPlan.smallTasks?.length || 0;

    return {
      completed: bigCompleted + mediumCompleted + smallCompleted,
      total: bigTotal + mediumTotal + smallTotal,
      big: { completed: bigCompleted, total: bigTotal },
      medium: { completed: mediumCompleted, total: mediumTotal },
      small: { completed: smallCompleted, total: smallTotal },
    };
  };

  const TaskSection: React.FC<{
    title: string;
    description: string;
    icon: string;
    color: string;
    maxTasks: number;
    currentTasks: Todo[];
    availableTasks: Todo[];
    category: 'big' | 'medium' | 'small';
  }> = ({ title, description, icon, color, maxTasks, currentTasks, availableTasks, category }) => {
    const [expanded, setExpanded] = useState(true);
    
    return (
      <View style={[styles.section, { borderLeftColor: color }]}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setExpanded(!expanded)}
        >
          <View style={styles.headerLeft}>
            <Ionicons name={icon as any} size={24} color={color} />
            <View style={styles.headerText}>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.sectionDescription}>{description}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.taskCount, { color }]}>
              {currentTasks.length}/{maxTasks}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#8E8E93"
            />
          </View>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.sectionContent}>
            {/* Current Tasks */}
            {currentTasks.map(todo => (
              <View key={todo.id} style={styles.assignedTask}>
                <TodoItem
                  todo={todo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                  compact
                />
                <TouchableOpacity
                  onPress={() => removeTaskFromPlan(todo)}
                  style={styles.removeButton}
                >
                  <Ionicons name="remove-circle-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Task Options */}
            {currentTasks.length < maxTasks && availableTasks.length > 0 && (
              <View style={styles.availableTasks}>
                <Text style={styles.availableTitle}>Available {category} tasks:</Text>
                {availableTasks.slice(0, 3).map(todo => (
                  <TouchableOpacity
                    key={todo.id}
                    style={styles.availableTask}
                    onPress={() => assignTask(todo, category)}
                  >
                    <Text style={styles.availableTaskTitle}>{todo.title}</Text>
                    <Ionicons name="add-circle-outline" size={20} color={color} />
                  </TouchableOpacity>
                ))}
                {availableTasks.length > 3 && (
                  <Text style={styles.moreAvailable}>
                    +{availableTasks.length - 3} more available
                  </Text>
                )}
              </View>
            )}

            {/* Empty State */}
            {currentTasks.length === 0 && availableTasks.length === 0 && (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>
                  No {category} tasks available. Create some tasks first!
                </Text>
              </View>
            )}

            {/* Full State */}
            {currentTasks.length >= maxTasks && (
              <View style={styles.fullSection}>
                <Text style={styles.fullText}>
                  ✨ Perfect! You've planned {maxTasks} {category} {maxTasks === 1 ? 'task' : 'tasks'} for today.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const todaysPlan = getTodaysPlan();
  const progress = getTodaysProgress();

  // For demo purposes, let's use actual tasks filtered by category
  const bigTasks = state.todos.filter(todo => !todo.completed && todo.category === 'big');
  const mediumTasks = state.todos.filter(todo => !todo.completed && todo.category === 'medium');
  const smallTasks = state.todos.filter(todo => !todo.completed && todo.category === 'small');

  const availableBig = getAvailableTasksByCategory('big');
  const availableMedium = getAvailableTasksByCategory('medium');
  const availableSmall = getAvailableTasksByCategory('small');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>1-3-5 Rule</Text>
        <Text style={styles.headerSubtitle}>
          Focus on 1 big, 3 medium, and 5 small tasks per day
        </Text>
      </View>

      {/* Week Navigation */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekNavigation}>
        {currentWeek.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              selectedDate.toDateString() === date.toDateString() && styles.selectedDay,
              isToday(date) && styles.todayButton,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[
              styles.dayText,
              selectedDate.toDateString() === date.toDateString() && styles.selectedDayText,
              isToday(date) && styles.todayText,
            ]}>
              {formatDate(date)}
            </Text>
            {isToday(date) && <View style={styles.todayIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Progress Overview */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>
            {isToday(selectedDate) ? "Today's Progress" : `Progress for ${formatDate(selectedDate)}`}
          </Text>
          <Text style={styles.progressScore}>
            {progress?.completed || 0}/{progress?.total || 0}
          </Text>
        </View>
        
        <View style={styles.progressBars}>
          <View style={styles.progressBar}>
            <View style={styles.progressBarLabel}>
              <Ionicons name="star" size={16} color="#FF3B30" />
              <Text style={styles.progressBarText}>Big</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View 
                style={[
                  styles.progressBarFill,
                  { 
                    width: (progress?.big?.total || 0) > 0 ? `${((progress?.big?.completed || 0) / (progress?.big?.total || 1)) * 100}%` : '0%',
                    backgroundColor: '#FF3B30'
                  }
                ]}
              />
            </View>
            <Text style={styles.progressBarCount}>{progress?.big?.completed || 0}/1</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={styles.progressBarLabel}>
              <Ionicons name="star-half" size={16} color="#FF9500" />
              <Text style={styles.progressBarText}>Medium</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View 
                style={[
                  styles.progressBarFill,
                  { 
                    width: (progress?.medium?.total || 0) > 0 ? `${((progress?.medium?.completed || 0) / (progress?.medium?.total || 1)) * 100}%` : '0%',
                    backgroundColor: '#FF9500'
                  }
                ]}
              />
            </View>
            <Text style={styles.progressBarCount}>{progress?.medium?.completed || 0}/3</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={styles.progressBarLabel}>
              <Ionicons name="star-outline" size={16} color="#34C759" />
              <Text style={styles.progressBarText}>Small</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View 
                style={[
                  styles.progressBarFill,
                  { 
                    width: (progress?.small?.total || 0) > 0 ? `${((progress?.small?.completed || 0) / (progress?.small?.total || 1)) * 100}%` : '0%',
                    backgroundColor: '#34C759'
                  }
                ]}
              />
            </View>
            <Text style={styles.progressBarCount}>{progress?.small?.completed || 0}/5</Text>
          </View>
        </View>
      </View>

      {/* Task Sections */}
      <TaskSection
        title="1 Big Task"
        description="Your most important accomplishment for the day"
        icon="star"
        color="#FF3B30"
        maxTasks={1}
        currentTasks={bigTasks}
        availableTasks={availableBig}
        category="big"
      />

      <TaskSection
        title="3 Medium Tasks"
        description="Important tasks that move you forward"
        icon="star-half"
        color="#FF9500"
        maxTasks={3}
        currentTasks={mediumTasks}
        availableTasks={availableMedium}
        category="medium"
      />

      <TaskSection
        title="5 Small Tasks"
        description="Quick wins and maintenance tasks"
        icon="star-outline"
        color="#34C759"
        maxTasks={5}
        currentTasks={smallTasks}
        availableTasks={availableSmall}
        category="small"
      />

      {/* Regenerate Plan Button */}
      <TouchableOpacity
        style={styles.regenerateButton}
        onPress={() => {
          Alert.alert(
            'Regenerate Week Plan',
            'This will create a new optimized plan for the entire week. Continue?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Regenerate', onPress: generateWeekPlan },
            ]
          );
        }}
      >
        <Ionicons name="refresh" size={20} color="#007AFF" />
        <Text style={styles.regenerateText}>Regenerate Week Plan</Text>
      </TouchableOpacity>

      {/* Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 1-3-5 Rule Tips:</Text>
        <Text style={styles.tipItem}>• Choose 1 big task that will make the biggest impact</Text>
        <Text style={styles.tipItem}>• Pick 3 medium tasks that support your goals</Text>
        <Text style={styles.tipItem}>• Select 5 small tasks for quick wins and maintenance</Text>
        <Text style={styles.tipItem}>• Complete tasks in order: big → medium → small</Text>
        <Text style={styles.tipItem}>• Don't exceed the limits - it defeats the purpose!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
  },
  weekNavigation: {
    marginBottom: 16,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
  },
  selectedDay: {
    backgroundColor: '#007AFF',
  },
  todayButton: {
    borderWidth: 2,
    borderColor: '#34C759',
  },
  dayText: {
    fontSize: 14,
    color: '#000',
  },
  selectedDayText: {
    color: '#fff',
  },
  todayText: {
    fontWeight: '600',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#34C759',
  },
  progressCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  progressScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressBars: {
    gap: 12,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 70,
  },
  progressBarText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressBarCount: {
    fontSize: 12,
    color: '#8E8E93',
    width: 30,
    textAlign: 'right',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  sectionDescription: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  assignedTask: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
    paddingRight: 12,
  },
  removeButton: {
    padding: 4,
  },
  availableTasks: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  availableTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 8,
  },
  availableTask: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 4,
  },
  availableTaskTitle: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  moreAvailable: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptySection: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  fullSection: {
    padding: 12,
    backgroundColor: '#D4EDDA',
    borderRadius: 8,
    marginTop: 8,
  },
  fullText: {
    fontSize: 14,
    color: '#155724',
    textAlign: 'center',
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  regenerateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  tipsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 4,
  },
});

export default Rule135Screen;