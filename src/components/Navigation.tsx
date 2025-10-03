import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { ViewType } from '../types';
import { useTheme } from '../contexts/ThemeContext';

// Import screens (we'll create these next)
import ListScreen from '../screens/ListScreen';
import KanbanScreen from '../screens/KanbanScreen';
import MatrixScreen from '../screens/MatrixScreen';
import Rule135Screen from '../screens/Rule135Screen';

const Drawer = createDrawerNavigator();

const Navigation: React.FC = () => {
  const { theme, colors, toggleTheme } = useTheme();

  const ThemeToggleButton = () => (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
      <Ionicons 
        name={theme === 'light' ? 'moon' : 'sunny'} 
        size={24} 
        color={colors.headerText} 
      />
    </TouchableOpacity>
  );

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: 'right',
          headerStyle: {
            backgroundColor: colors.headerBackground,
          },
          headerTintColor: colors.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <ThemeToggleButton />,
          drawerStyle: {
            backgroundColor: colors.surface,
          },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.textSecondary,
          drawerLabelStyle: {
            marginLeft: -16,
          },
        }}
      >
        <Drawer.Screen 
          name="List" 
          component={ListScreen}
          options={{ 
            title: 'Todo List',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Kanban" 
          component={KanbanScreen}
          options={{ 
            title: 'Kanban Board',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Matrix" 
          component={MatrixScreen}
          options={{ 
            title: 'Priority Matrix',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'analytics' : 'analytics-outline'} size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="1-3-5 Rule" 
          component={Rule135Screen}
          options={{ 
            title: '1-3-5 Rule',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;