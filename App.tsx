import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { TodoProvider } from './src/contexts/TodoContext';
import Navigation from './src/components/Navigation';

function ThemedApp() {
  const { theme } = useTheme();
  
  return (
    <>
      <Navigation />
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <ThemedApp />
      </TodoProvider>
    </ThemeProvider>
  );
}
