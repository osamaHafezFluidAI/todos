import React, { useState } from 'react';
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
import { Todo } from '../types';

const MatrixScreen: React.FC = () => {
  const { state, updateTodo, deleteTodo } = useTodos();
  const [expandedQuadrant, setExpandedQuadrant] = useState<string | null>(null);

  // Eisenhower Matrix Quadrants
  const getQuadrantTodos = (urgent: boolean, important: boolean) => {
    return state.todos.filter(todo => 
      !todo.completed && 
      todo.urgent === urgent && 
      todo.important === important
    );
  };

  const doFirst = getQuadrantTodos(true, true);     // Urgent + Important
  const schedule = getQuadrantTodos(false, true);   // Not Urgent + Important  
  const delegate = getQuadrantTodos(true, false);   // Urgent + Not Important
  const eliminate = getQuadrantTodos(false, false); // Not Urgent + Not Important

  const moveToQuadrant = (todo: Todo, urgent: boolean, important: boolean) => {
    const updatedTodo = { ...todo, urgent, important };
    updateTodo(updatedTodo);
  };

  const handleQuadrantChange = (todo: Todo) => {
    const options = [
      { text: 'Do First (Urgent + Important)', onPress: () => moveToQuadrant(todo, true, true) },
      { text: 'Schedule (Important)', onPress: () => moveToQuadrant(todo, false, true) },
      { text: 'Delegate (Urgent)', onPress: () => moveToQuadrant(todo, true, false) },
      { text: 'Eliminate (Neither)', onPress: () => moveToQuadrant(todo, false, false) },
      { text: 'Cancel', style: 'cancel' as const },
    ];

    Alert.alert('Move to Quadrant', 'Select the appropriate quadrant:', options);
  };

  const QuadrantCard: React.FC<{
    title: string;
    subtitle: string;
    todos: Todo[];
    color: string;
    icon: string;
    quadrantKey: string;
  }> = ({ title, subtitle, todos, color, icon, quadrantKey }) => {
    const isExpanded = expandedQuadrant === quadrantKey;
    
    return (
      <View style={[styles.quadrant, { borderColor: color }]}>
        <TouchableOpacity
          style={[styles.quadrantHeader, { backgroundColor: color }]}
          onPress={() => setExpandedQuadrant(isExpanded ? null : quadrantKey)}
        >
          <View style={styles.headerLeft}>
            <Ionicons name={icon as any} size={20} color="#fff" />
            <View style={styles.headerText}>
              <Text style={styles.quadrantTitle}>{title}</Text>
              <Text style={styles.quadrantSubtitle}>{subtitle}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{todos.length}</Text>
            </View>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#fff"
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.quadrantContent}>
            {todos.length === 0 ? (
              <View style={styles.emptyQuadrant}>
                <Ionicons name="checkmark-circle-outline" size={32} color="#8E8E93" />
                <Text style={styles.emptyText}>No tasks in this quadrant</Text>
                <Text style={styles.emptySubtext}>
                  {quadrantKey === 'doFirst' && 'Handle urgent and important tasks here'}
                  {quadrantKey === 'schedule' && 'Plan important but not urgent tasks'}
                  {quadrantKey === 'delegate' && 'Urgent tasks that others can handle'}
                  {quadrantKey === 'eliminate' && 'Consider removing these tasks'}
                </Text>
              </View>
            ) : (
              todos.map(todo => (
                <View key={todo.id} style={styles.matrixTodoItem}>
                  <TouchableOpacity
                    onLongPress={() => handleQuadrantChange(todo)}
                    style={styles.todoContent}
                  >
                    <View style={styles.todoHeader}>
                      <Text style={styles.todoTitle}>{todo.title}</Text>
                      <View style={styles.todoActions}>
                        <TouchableOpacity
                          onPress={() => handleQuadrantChange(todo)}
                          style={styles.moveButton}
                        >
                          <Ionicons name="swap-horizontal-outline" size={16} color="#007AFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => updateTodo({ ...todo, completed: true })}
                          style={styles.completeButton}
                        >
                          <Ionicons name="checkmark-outline" size={16} color="#34C759" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {todo.description && (
                      <Text style={styles.todoDescription} numberOfLines={2}>
                        {todo.description}
                      </Text>
                    )}
                    
                    <View style={styles.todoMetadata}>
                      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(todo.priority) }]}>
                        <Text style={styles.badgeText}>{todo.priority.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.categoryText}>{todo.category}</Text>
                      <Text style={styles.statusText}>{todo.status.replace('-', ' ')}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getRecommendation = () => {
    if (doFirst.length > 0) {
      return "🔥 Focus on 'Do First' tasks - they're urgent and important!";
    } else if (schedule.length > 0) {
      return "📅 Great! Now schedule your important tasks to prevent them from becoming urgent.";
    } else if (delegate.length > 0) {
      return "🤝 Consider delegating urgent tasks that aren't important to you.";
    } else if (eliminate.length > 0) {
      return "🗑️ Review tasks in 'Eliminate' - do they really need to be done?";
    } else {
      return "✨ All quadrants are clear! Add some tasks to see them organized by priority.";
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Matrix Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eisenhower Priority Matrix</Text>
        <Text style={styles.headerSubtitle}>
          Organize tasks by urgency and importance
        </Text>
      </View>

      {/* Recommendation */}
      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationText}>{getRecommendation()}</Text>
      </View>

      {/* Matrix Grid */}
      <View style={styles.matrixGrid}>
        <QuadrantCard
          title="Do First"
          subtitle="Urgent + Important"
          todos={doFirst}
          color="#FF3B30"
          icon="flash"
          quadrantKey="doFirst"
        />

        <QuadrantCard
          title="Schedule"
          subtitle="Important, Not Urgent"
          todos={schedule}
          color="#007AFF"
          icon="calendar"
          quadrantKey="schedule"
        />

        <QuadrantCard
          title="Delegate"
          subtitle="Urgent, Not Important"
          todos={delegate}
          color="#FF9500"
          icon="people"
          quadrantKey="delegate"
        />

        <QuadrantCard
          title="Eliminate"
          subtitle="Neither Urgent nor Important"
          todos={eliminate}
          color="#8E8E93"
          icon="trash"
          quadrantKey="eliminate"
        />
      </View>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <Text style={styles.helpTitle}>How to use the Matrix:</Text>
        <Text style={styles.helpItem}>• <Text style={styles.helpBold}>Do First:</Text> Crisis, emergencies, deadline-driven tasks</Text>
        <Text style={styles.helpItem}>• <Text style={styles.helpBold}>Schedule:</Text> Prevention, planning, personal development</Text>
        <Text style={styles.helpItem}>• <Text style={styles.helpBold}>Delegate:</Text> Interruptions, some meetings, some emails</Text>
        <Text style={styles.helpItem}>• <Text style={styles.helpBold}>Eliminate:</Text> Time wasters, excessive social media, trivial activities</Text>
        <Text style={styles.helpFooter}>💡 Long press any task to move it between quadrants</Text>
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
  recommendationCard: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  recommendationText: {
    fontSize: 16,
    color: '#856404',
    fontWeight: '500',
  },
  matrixGrid: {
    gap: 12,
  },
  quadrant: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quadrantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
  },
  quadrantTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  quadrantSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  quadrantContent: {
    padding: 16,
  },
  emptyQuadrant: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
  },
  matrixTodoItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  todoContent: {
    flex: 1,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  todoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  todoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  moveButton: {
    padding: 4,
  },
  completeButton: {
    padding: 4,
  },
  todoDescription: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
    marginBottom: 8,
  },
  todoMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#fff',
  },
  categoryText: {
    fontSize: 10,
    color: '#8E8E93',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  statusText: {
    fontSize: 10,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  helpSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  helpItem: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 4,
  },
  helpBold: {
    fontWeight: '600',
    color: '#000',
  },
  helpFooter: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default MatrixScreen;