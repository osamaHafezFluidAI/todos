import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { ViewType } from '../types';

// Import screens (we'll create these next)
import ListScreen from '../screens/ListScreen';
import KanbanScreen from '../screens/KanbanScreen';
import MatrixScreen from '../screens/MatrixScreen';
import Rule135Screen from '../screens/Rule135Screen';

const Drawer = createDrawerNavigator();

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: 'right',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerActiveTintColor: '#007AFF',
          drawerInactiveTintColor: 'gray',
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