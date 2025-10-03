import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Todo, Priority, TaskCategory, TaskStatus } from '../types';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
  showCategory?: boolean;
  showStatus?: boolean;
  compact?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  showCategory = false,
  showStatus = false,
  compact = false,
}) => {
  const { colors } = useTheme();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const toggleCompleted = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getCategoryIcon = (category: TaskCategory) => {
    switch (category) {
      case 'big': return 'star';
      case 'medium': return 'star-half';
      case 'small': return 'star-outline';
      default: return 'star-outline';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return '#8E8E93';
      case 'in-progress': return '#007AFF';
      case 'done': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const handleSaveEdit = () => {
    onUpdate({
      ...todo,
      title: editTitle,
      description: editDescription,
    });
    setShowEditModal(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(todo.id) },
      ]
    );
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }, compact && styles.compact]}>
        <TouchableOpacity onPress={toggleCompleted} style={styles.checkboxContainer}>
          <Ionicons
            name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={todo.completed ? '#34C759' : colors.textSecondary}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              todo.completed && styles.completedText,
              compact && styles.compactTitle,
            ]}
          >
            {todo.title}
          </Text>

          {!compact && todo.description && (
            <Text style={[styles.description, { color: colors.textSecondary }, todo.completed && styles.completedText]}>
              {todo.description}
            </Text>
          )}

          <View style={styles.metadata}>
            <View
              style={[styles.priorityBadge, { backgroundColor: getPriorityColor(todo.priority) }]}
            >
              <Text style={styles.badgeText}>{todo.priority.toUpperCase()}</Text>
            </View>

            {showCategory && (
              <View style={styles.categoryContainer}>
                <Ionicons
                  name={getCategoryIcon(todo.category)}
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{todo.category}</Text>
              </View>
            )}

            {showStatus && (
              <View
                style={[styles.statusBadge, { backgroundColor: getStatusColor(todo.status) }]}
              >
                <Text style={styles.badgeText}>{todo.status.replace('-', ' ').toUpperCase()}</Text>
              </View>
            )}

            {(todo.urgent || todo.important) && (
              <View style={styles.matrixIndicator}>
                {todo.urgent && <Text style={styles.matrixText}>U</Text>}
                {todo.important && <Text style={styles.matrixText}>I</Text>}
              </View>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => setShowEditModal(true)} style={styles.actionButton}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Task</Text>
            <TouchableOpacity onPress={handleSaveEdit}>
              <Text style={[styles.saveButton, { color: colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Task title"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
            <TextInput
              style={[styles.input, styles.descriptionInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    alignItems: 'flex-start',
  },
  compact: {
    padding: 8,
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  compactTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  matrixIndicator: {
    flexDirection: 'row',
    gap: 2,
  },
  matrixText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF9500',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 16,
    color: '#8E8E93',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default TodoItem;