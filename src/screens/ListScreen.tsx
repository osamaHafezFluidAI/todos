import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTodos } from '../contexts/TodoContext';
import { useTheme } from '../contexts/ThemeContext';
import TodoItem from '../components/TodoItem';
import { Todo, Priority, TaskCategory, TaskStatus } from '../types';

const ListScreen: React.FC = () => {
  const { state, addTodo, updateTodo, deleteTodo } = useTodos();
  const { colors } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newCategory, setNewCategory] = useState<TaskCategory>('medium');
  const [newUrgent, setNewUrgent] = useState(false);
  const [newImportant, setNewImportant] = useState(false);
  const [filterBy, setFilterBy] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'category'>('created');

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
    setNewCategory('medium');
    setNewUrgent(false);
    setNewImportant(false);
  };

  const handleAddTodo = () => {
    if (!newTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    addTodo({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      completed: false,
      priority: newPriority,
      category: newCategory,
      status: 'todo',
      urgent: newUrgent,
      important: newImportant,
      tags: [],
    });

    resetForm();
    setShowAddModal(false);
  };

  const getFilteredAndSortedTodos = () => {
    let filtered = state.todos;

    // Apply filter
    switch (filterBy) {
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      case 'pending':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      default:
        break;
    }

    // Apply sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'category':
          const categoryOrder = { big: 3, medium: 2, small: 1 };
          return categoryOrder[b.category] - categoryOrder[a.category];
        case 'created':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  };

  const renderTodo = ({ item }: { item: Todo }) => (
    <TodoItem
      todo={item}
      onUpdate={updateTodo}
      onDelete={deleteTodo}
      showCategory
      showStatus
    />
  );

  const filteredTodos = getFilteredAndSortedTodos();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Filter and Sort Controls */}
      <View style={[styles.controls, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: filterBy === 'all' ? colors.primary : colors.background }, filterBy === 'all' && styles.activeFilter]}
            onPress={() => setFilterBy('all')}
          >
            <Text style={[styles.filterText, { color: filterBy === 'all' ? '#fff' : colors.textSecondary }, filterBy === 'all' && styles.activeFilterText]}>
              All ({state.todos.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: filterBy === 'pending' ? colors.primary : colors.background }, filterBy === 'pending' && styles.activeFilter]}
            onPress={() => setFilterBy('pending')}
          >
            <Text style={[styles.filterText, { color: filterBy === 'pending' ? '#fff' : colors.textSecondary }, filterBy === 'pending' && styles.activeFilterText]}>
              Pending ({state.todos.filter(t => !t.completed).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: filterBy === 'completed' ? colors.primary : colors.background }, filterBy === 'completed' && styles.activeFilter]}
            onPress={() => setFilterBy('completed')}
          >
            <Text style={[styles.filterText, { color: filterBy === 'completed' ? '#fff' : colors.textSecondary }, filterBy === 'completed' && styles.activeFilterText]}>
              Done ({state.todos.filter(t => t.completed).length})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const sorts: Array<typeof sortBy> = ['created', 'priority', 'category'];
            const currentIndex = sorts.indexOf(sortBy);
            setSortBy(sorts[(currentIndex + 1) % sorts.length]);
          }}
        >
          <Ionicons name="funnel-outline" size={20} color={colors.primary} />
          <Text style={[styles.sortText, { color: colors.primary }]}>
            {sortBy === 'created' ? 'Date' : sortBy === 'priority' ? 'Priority' : 'Category'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Todo List */}
      <FlatList
        data={filteredTodos}
        renderItem={renderTodo}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={filteredTodos.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No tasks found</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {filterBy === 'all'
                ? 'Add your first task to get started'
                : filterBy === 'pending'
                ? 'All tasks completed!'
                : 'No completed tasks yet'}
            </Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={() => setShowAddModal(true)}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Add Todo Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Task</Text>
            <TouchableOpacity onPress={handleAddTodo}>
              <Text style={[styles.saveButton, { color: colors.primary }]}>Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Task title"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />

            <TextInput
              style={[styles.input, styles.descriptionInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
              value={newDescription}
              onChangeText={setNewDescription}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textSecondary}
              multiline
            />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Priority</Text>
            <View style={styles.optionRow}>
              {(['low', 'medium', 'high'] as Priority[]).map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.optionButton,
                    { borderColor: colors.border, backgroundColor: newPriority === priority ? colors.primary : colors.surface },
                    newPriority === priority && styles.selectedOption,
                  ]}
                  onPress={() => setNewPriority(priority)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: newPriority === priority ? '#fff' : colors.text },
                      newPriority === priority && styles.selectedOptionText,
                    ]}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Size (for 1-3-5 Rule)</Text>
            <View style={styles.optionRow}>
              {(['small', 'medium', 'big'] as TaskCategory[]).map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.optionButton,
                    { borderColor: colors.border, backgroundColor: newCategory === category ? colors.primary : colors.surface },
                    newCategory === category && styles.selectedOption,
                  ]}
                  onPress={() => setNewCategory(category)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: newCategory === category ? '#fff' : colors.text },
                      newCategory === category && styles.selectedOptionText,
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Eisenhower Matrix</Text>
            <View style={styles.matrixOptions}>
              <TouchableOpacity
                style={[styles.matrixOption, { borderColor: newUrgent ? colors.primary : colors.border, backgroundColor: newUrgent ? colors.background : colors.surface }, newUrgent && styles.selectedMatrixOption]}
                onPress={() => setNewUrgent(!newUrgent)}
              >
                <Ionicons
                  name={newUrgent ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={newUrgent ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.matrixOptionText, { color: colors.text }]}>Urgent</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.matrixOption, { borderColor: newImportant ? colors.primary : colors.border, backgroundColor: newImportant ? colors.background : colors.surface }, newImportant && styles.selectedMatrixOption]}
                onPress={() => setNewImportant(!newImportant)}
              >
                <Ionicons
                  name={newImportant ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={newImportant ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.matrixOptionText, { color: colors.text }]}>Important</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  controls: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  activeFilterText: {
    color: '#fff',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: '#007AFF',
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    flex: 1,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
  },
  selectedOptionText: {
    color: '#fff',
  },
  matrixOptions: {
    gap: 12,
    marginBottom: 16,
  },
  matrixOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedMatrixOption: {
    backgroundColor: '#F0F8FF',
    borderColor: '#007AFF',
  },
  matrixOptionText: {
    fontSize: 16,
  },
});

export default ListScreen;