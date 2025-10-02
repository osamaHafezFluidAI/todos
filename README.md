# React Native Todo App

A comprehensive todo list tracking app built with React Native and Expo, supporting multiple productivity methodologies.

## Features

### 🎯 Four Powerful Views
- **List View**: Traditional todo list with filtering, sorting, and task management
- **Kanban Board**: Visual board with To Do, In Progress, and Review columns
- **Priority Matrix**: Eisenhower Matrix organizing tasks by urgent/important quadrants
- **1-3-5 Rule**: Daily planning limiting tasks to 1 big, 3 medium, 5 small per day

### ✨ Core Features
- ✅ Add, edit, delete, and complete tasks
- 🏷️ Priority levels (high, medium, low)
- 📊 Task categories for 1-3-5 rule (big, medium, small)  
- 🔄 Task status for Kanban (todo, in-progress, done)
- ⚡ Urgent/Important flags for Priority Matrix
- 💾 Persistent data storage with AsyncStorage
- 📱 Cross-platform support (Web, iOS, Android)

### 🎨 User Experience
- Clean, modern iOS-style design
- Interactive gestures (long press to move tasks)
- Visual progress indicators
- Empty states and helpful tips
- Confirmation dialogs for destructive actions

## Getting Started

### Prerequisites
- Node.js (14 or higher)
- npm or yarn
- Expo CLI (for mobile development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/osamaHafezFluidAI/todos.git
cd todos
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
# For web
npm run web

# For iOS simulator
npm run ios

# For Android emulator
npm run android

# Start Expo dev server
npm start
```

## Usage Guide

### List View
- **Add Tasks**: Click the blue "+" button to create new tasks
- **Edit Tasks**: Click the edit icon on any task
- **Complete Tasks**: Click the circle icon to mark as complete
- **Filter**: Use All/Pending/Done tabs to filter tasks
- **Sort**: Click the filter icon to sort by date, priority, or category

### Kanban Board
- **Move Tasks**: Long press any task to move between columns
- **Visual Progress**: See tasks organized by status (To Do, In Progress, Review)
- **Quick Actions**: Use the arrow and delete buttons on each card

### Priority Matrix (Eisenhower Matrix)
- **Four Quadrants**:
  - **Do First**: Urgent + Important (red)
  - **Schedule**: Important, Not Urgent (blue)
  - **Delegate**: Urgent, Not Important (orange)
  - **Eliminate**: Neither Urgent nor Important (gray)
- **Move Tasks**: Long press to move between quadrants
- **Smart Recommendations**: Get suggestions based on your task distribution

### 1-3-5 Rule
- **Daily Planning**: Focus on 1 big, 3 medium, 5 small tasks per day
- **Week Navigation**: Switch between days using the horizontal scroll
- **Progress Tracking**: Visual progress bars for each category
- **Task Assignment**: Click available tasks to assign them to today
- **Week Optimization**: Generate optimized weekly plans

## Task Properties

When creating tasks, you can set:
- **Title** and **Description**
- **Priority**: Low, Medium, High
- **Category**: Small, Medium, Big (for 1-3-5 rule)
- **Matrix Flags**: Urgent and/or Important (for Priority Matrix)

## Architecture

### Tech Stack
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation between screens
- **AsyncStorage**: Local data persistence
- **React Context**: State management

### Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── Navigation.tsx  # Tab navigation setup
│   └── TodoItem.tsx    # Individual task component
├── contexts/           # React Context providers
│   └── TodoContext.tsx # Global state management
├── screens/            # Main app screens
│   ├── ListScreen.tsx      # List view
│   ├── KanbanScreen.tsx    # Kanban board
│   ├── MatrixScreen.tsx    # Priority Matrix
│   └── Rule135Screen.tsx   # 1-3-5 Rule
├── types/              # TypeScript type definitions
│   └── index.ts        # App-wide types
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Productivity Methodologies

This app implements several proven productivity methodologies:

### Eisenhower Matrix
Categorizes tasks by urgency and importance to help prioritize effectively.

### 1-3-5 Rule
Limits daily tasks to prevent overwhelming yourself:
- 1 big task (most important)
- 3 medium tasks (secondary priorities)  
- 5 small tasks (quick wins)

### Kanban Method
Visual workflow management using columns to track task progression.
