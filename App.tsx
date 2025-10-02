import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { TodoProvider } from './src/contexts/TodoContext';
import Navigation from './src/components/Navigation';

export default function App() {
  return (
    <TodoProvider>
      <Navigation />
      <StatusBar style="auto" />
    </TodoProvider>
  );
}
