# Apple-Style Todo Manager

A beautiful, modern todo application built with React, TypeScript, and Tailwind CSS, featuring an Apple-inspired design with smooth animations and advanced drag & drop functionality.

## 🌐 Live Demo

**[View Live Demo →](https://todo.smorchkov.online)**

Experience the app in action with all features including drag & drop reordering, visual countdown timers, and smooth animations.

## Features

### ✨ Core Functionality
- **Category Management**: Create, edit, and delete custom categories with colors and icons/emojis
- **Todo Management**: Add, edit, complete, and delete todos with full CRUD operations
- **Drag & Drop Reordering**: Intuitive drag and drop to reorder tasks within categories
- **Smart Archive System**: Completed todos are automatically archived with visual countdown
- **Persistent Storage**: All data is saved to localStorage with automatic migration

### 🎨 Design & UX
- **Apple-inspired UI**: Clean, modern interface with subtle shadows and rounded corners
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Visual Feedback**: Hover states, drag indicators, and smooth transitions
- **Dark Mode Support**: Seamless dark/light theme integration
- **No Scrolling in Sidebar**: Categories container adjusts its size to fit content
- **Icon & Emoji Support**: Choose from predefined icons or select from 12 popular emojis

### 🚀 Advanced Features
- **Drag & Drop Reordering**: 
  - Drag handle appears on hover for incomplete tasks
  - Visual drop line indicators show exact insertion point
  - Smooth animations during drag operations
  - Custom drag ghost with transparency and positioning
- **Archive Countdown Timer**: 
  - 3-second visual countdown before auto-archiving completed tasks
  - Real-time countdown display with smooth animations
  - Instant cancellation when task is uncompleted
- **Smart State Management**: 
  - Automatic data migration for new features
  - Proper cleanup of timeouts and intervals
  - Optimized re-renders with React.memo and useMemo

### ⌨️ Keyboard Shortcuts
- **⌘N / Ctrl+N**: Focus the new todo input field
- **Escape**: Cancel editing mode
- **Enter**: Save changes when editing

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TO-DO\ app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Managing Categories
1. **Create a Category**: Click the "+" button next to "Categories"
2. **Choose Icon/Emoji**: Toggle between predefined icons and emojis, then select your preferred option
3. **Edit a Category**: Click the "⋯" menu next to any category and select "Edit"
4. **Delete a Category**: Click the "⋯" menu and select "Delete" (requires at least 2 categories)

### Managing Todos
1. **Add a Todo**: Type in the input field at the bottom and press Enter
2. **Complete a Todo**: Click the circle next to the todo item
3. **Edit a Todo**: Click on the todo text (for incomplete todos only)
4. **Delete a Todo**: Hover over a todo and click the trash icon
5. **Reorder Todos**: Hover over incomplete todos to see drag handle, then drag to reorder

### Drag & Drop Reordering
- **Drag Handle**: Appears on hover for incomplete todos only
- **Visual Feedback**: Blue drop line shows where the task will be inserted
- **Smooth Animation**: Tasks animate to their new positions
- **Smart Positioning**: Drop above or below target based on mouse position

### Archive System
- **Auto-Archive**: Completed todos show a 3-second countdown timer before archiving
- **Visual Countdown**: Real-time timer shows remaining seconds (e.g., "2.1s")
- **Instant Unarchive**: Unchecking a completed task immediately cancels archiving
- **Archive View**: View all archived todos by clicking the "Archive" section
- **Return to Active**: Click the back arrow to return to active todos

## Project Structure

```
src/
├── components/          # React components
│   ├── CategoryForm.tsx    # Category creation/editing form
│   ├── CategorySidebar.tsx # Left sidebar with categories
│   ├── TodoForm.tsx        # Todo input form
│   ├── TodoItem.tsx        # Individual todo item with drag & drop
│   └── TodoList.tsx        # Main todo list view with reordering
├── context/
│   └── AppContext.tsx      # Global state management with reorder logic
├── hooks/                  # Custom React hooks
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx               # Main app component
├── index.css            # Global styles and Tailwind imports
└── main.tsx            # App entry point
```

## Technologies Used

- **React 18** - UI library with hooks and modern patterns
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth interactions
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server
- **nanoid** - Unique ID generation
- **HTML5 Drag & Drop API** - Native drag and drop functionality

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Drag & Drop System
- **Visual Indicators**: Drag handle (grip icon) appears on hover for incomplete tasks
- **Drop Line Feedback**: Blue horizontal line with circular caps shows insertion point
- **Custom Drag Ghost**: Semi-transparent preview positioned at exact click point
- **Smart Positioning**: Automatically detects whether to insert above or below target
- **Smooth Animations**: All state changes include 200ms transitions
- **Proper State Management**: Hover states reset correctly during drag operations

### Archive Countdown Timer
- **3-Second Delay**: Gives users time to change their mind after completing tasks
- **Visual Countdown**: Amber badge shows remaining time with 0.1s precision
- **Smooth Updates**: Timer updates every 100ms for fluid animation
- **Instant Cancellation**: Unchecking task immediately stops countdown and prevents archiving
- **Proper Cleanup**: All timers and intervals are cleaned up on component unmount

### Category System
- **Custom Colors**: Choose from 8 predefined colors
- **Custom Icons & Emojis**: Select from 4 different icon types or 12 popular emojis
- **Full Editing**: Change name, color, and icon/emoji after creation
- **Smart Deletion**: Prevents deletion of the last category
- **Order Persistence**: Task order is maintained within each category

### Todo System
- **Smart Ordering**: Tasks maintain custom order set by drag & drop
- **Auto-completion**: Todos are automatically archived after 3-second countdown
- **Inline Editing**: Edit todos directly in the list (incomplete todos only)
- **Hover Interactions**: Drag handle and delete button appear on hover
- **State Persistence**: All changes are immediately saved to localStorage

### Data Persistence & Migration
- **Automatic Migration**: Existing data is automatically updated with new fields (like `order`)
- **Graceful Fallbacks**: Handles missing data gracefully with sensible defaults
- **State Validation**: Validates and repairs data on app startup
- **Error Handling**: Graceful degradation if localStorage is unavailable

## Performance Optimizations

- **React.memo**: TodoItem components are memoized to prevent unnecessary re-renders
- **useMemo**: Expensive calculations are memoized in context
- **Proper Dependencies**: useEffect hooks have correct dependency arrays
- **Event Delegation**: Efficient event handling for drag & drop operations
- **Cleanup Management**: All timeouts and intervals are properly cleaned up

## Browser Support

This app works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- localStorage API
- HTML5 Drag & Drop API
- CSS transforms and transitions

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── CategoryForm.tsx    # Category creation/editing form
│   ├── CategorySidebar.tsx # Left sidebar with categories
│   ├── TodoForm.tsx        # Todo input form
│   ├── TodoItem.tsx        # Individual todo item with drag & drop
│   └── TodoList.tsx        # Main todo list view with reordering
├── context/
│   └── AppContext.tsx      # Global state management with reorder logic
├── hooks/                  # Custom React hooks
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx               # Main app component
├── index.css            # Global styles and Tailwind imports
└── main.tsx            # App entry point
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (especially drag & drop functionality)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

## License

This project is open source and available under the MIT License. 