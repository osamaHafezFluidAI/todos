import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ViewType } from '../types';

// Import screens (we'll create these next)
import ListScreen from '../screens/ListScreen';
import KanbanScreen from '../screens/KanbanScreen';
import MatrixScreen from '../screens/MatrixScreen';
import Rule135Screen from '../screens/Rule135Screen';

const Tab = createBottomTabNavigator();

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'List':
                iconName = focused ? 'list' : 'list-outline';
                break;
              case 'Kanban':
                iconName = focused ? 'grid' : 'grid-outline';
                break;
              case 'Matrix':
                iconName = focused ? 'analytics' : 'analytics-outline';
                break;
              case '1-3-5 Rule':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
              default:
                iconName = 'list';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="List" 
          component={ListScreen}
          options={{ title: 'Todo List' }}
        />
        <Tab.Screen 
          name="Kanban" 
          component={KanbanScreen}
          options={{ title: 'Kanban Board' }}
        />
        <Tab.Screen 
          name="Matrix" 
          component={MatrixScreen}
          options={{ title: 'Priority Matrix' }}
        />
        <Tab.Screen 
          name="1-3-5 Rule" 
          component={Rule135Screen}
          options={{ title: '1-3-5 Rule' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;