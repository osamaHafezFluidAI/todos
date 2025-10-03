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
import { useTheme } from '../contexts/ThemeContext';
import TodoItem from '../components/TodoItem';
import { Todo, TaskStatus } from '../types';

const KanbanScreen: React.FC = () => {
  const { state, updateTodo, deleteTodo } = useTodos();
  const { colors } = useTheme();

  const getTasksByStatus = (status: TaskStatus) => {
    return state.todos.filter(todo => todo.status === status && !todo.completed);
  };

  const getCompletedTasks = () => {
    return state.todos.filter(todo => todo.completed);
  };

  const moveTask = (todo: Todo, newStatus: TaskStatus) => {
    const updatedTodo = { 
      ...todo, 
      status: newStatus,
      completed: newStatus === 'done'
    };
    updateTodo(updatedTodo);
  };

  const handleStatusChange = (todo: Todo) => {
    const statusOptions: { label: string; value: TaskStatus }[] = [
      { label: 'To Do', value: 'todo' },
      { label: 'In Progress', value: 'in-progress' },
      { label: 'Done', value: 'done' },
    ];

    Alert.alert(
      'Move Task',
      'Select new status:',
      [
        ...statusOptions.map(option => ({
          text: option.label,
          onPress: () => moveTask(todo, option.value),
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const KanbanColumn: React.FC<{
    title: string;
    status: TaskStatus;
    todos: Todo[];
    color: string;
  }> = ({ title, status, todos, color }) => (
    <View style={[styles.column, { backgroundColor: colors.surface }]}>
      <View style={[styles.columnHeader, { backgroundColor: color }]}>
        <Text style={styles.columnTitle}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{todos.length}</Text>
        </View>
      </View>
      
      <ScrollView style={styles.columnContent} showsVerticalScrollIndicator={false}>
        {todos.length === 0 ? (
          <View style={styles.emptyColumn}>
            <Ionicons 
              name={
                status === 'todo' ? 'list-outline' :
                status === 'in-progress' ? 'time-outline' : 'checkmark-circle-outline'
              } 
              size={32} 
              color={colors.textSecondary} 
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No tasks</Text>
          </View>
        ) : (
          todos.map(todo => (
            <View key={todo.id} style={[styles.kanbanCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TouchableOpacity
                onLongPress={() => handleStatusChange(todo)}
                style={styles.cardContent}
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>{todo.title}</Text>
                {todo.description && (
                  <Text style={[styles.cardDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {todo.description}
                  </Text>
                )}
                
                <View style={styles.cardMetadata}>
                  <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(todo.priority) }]} />
                  <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{todo.category}</Text>
                  
                  {(todo.urgent || todo.important) && (
                    <View style={styles.matrixIndicator}>
                      {todo.urgent && <Text style={styles.matrixText}>U</Text>}
                      {todo.important && <Text style={styles.matrixText}>I</Text>}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() => handleStatusChange(todo)}
                  style={styles.moveButton}
                >
                  <Ionicons name="arrow-forward-outline" size={16} color={colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Delete Task',
                      'Are you sure you want to delete this task?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', style: 'destructive', onPress: () => deleteTodo(todo.id) },
                      ]
                    );
                  }}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const todoTasks = getTasksByStatus('todo');
  const inProgressTasks = getTasksByStatus('in-progress');
  const doneTasks = getTasksByStatus('done');
  const completedTasks = getCompletedTasks();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        horizontal 
        style={styles.kanbanBoard}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.boardContent}
      >
        <KanbanColumn
          title="To Do"
          status="todo"
          todos={todoTasks}
          color="#8E8E93"
        />
        
        <KanbanColumn
          title="In Progress"
          status="in-progress"
          todos={inProgressTasks}
          color="#007AFF"
        />
        
        <KanbanColumn
          title="Review"
          status="done"
          todos={doneTasks}
          color="#FF9500"
        />
      </ScrollView>

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <View style={[styles.completedSection, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.completedHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.completedTitle}>
              Completed Tasks ({completedTasks.length})
            </Text>
            <Ionicons name="chevron-down-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Help Text */}
      <View style={[styles.helpSection, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Text style={[styles.helpText, { color: colors.textSecondary }]}>
          💡 Long press any task to move it between columns
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  kanbanBoard: {
    flex: 1,
  },
  boardContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  column: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    maxHeight: '90%',
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
  columnContent: {
    flex: 1,
    padding: 12,
  },
  emptyColumn: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
  kanbanCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  cardContent: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
    marginBottom: 8,
  },
  cardMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    color: '#8E8E93',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  matrixIndicator: {
    flexDirection: 'row',
    gap: 2,
    marginLeft: 'auto',
  },
  matrixText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FF9500',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 6,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  moveButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  completedSection: {
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34C759',
    flex: 1,
  },
  helpSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  helpText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default KanbanScreen;