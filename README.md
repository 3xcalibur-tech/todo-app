# Apple-Style Todo Manager

A beautiful, modern todo application built with React, TypeScript, and Tailwind CSS, featuring an Apple-inspired design with smooth animations.

## Features

### ✨ Core Functionality
- **Category Management**: Create, edit, and delete custom categories with colors and icons/emojis
- **Todo Management**: Add, edit, complete, and delete todos
- **Archive System**: Completed todos are automatically archived
- **Persistent Storage**: All data is saved to localStorage

### 🎨 Design & UX
- **Apple-inspired UI**: Clean, modern interface with subtle shadows and rounded corners
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **No Scrolling in Sidebar**: Categories container adjusts its size to fit content
- **Icon & Emoji Support**: Choose from predefined icons or select from 12 popular emojis

### ⌨️ Keyboard Shortcuts
- **⌘N / Ctrl+N**: Focus the new todo input field

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
3. **Edit a Todo**: Hover over a todo and click the pencil icon
4. **Delete a Todo**: Hover over a todo and click the trash icon

### Archive
- Completed todos are automatically archived after 1 second
- View archived todos by clicking the "Archive" section
- Return to active todos by clicking the back arrow

## Project Structure

```
src/
├── components/          # React components
│   ├── CategoryForm.tsx    # Category creation/editing form
│   ├── CategorySidebar.tsx # Left sidebar with categories
│   ├── TodoForm.tsx        # Todo input form
│   ├── TodoItem.tsx        # Individual todo item
│   └── TodoList.tsx        # Main todo list view
├── context/
│   └── AppContext.tsx      # Global state management
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx               # Main app component
├── index.css            # Global styles and Tailwind imports
└── main.tsx            # App entry point
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server
- **nanoid** - Unique ID generation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Category System
- **Custom Colors**: Choose from 8 predefined colors
- **Custom Icons & Emojis**: Select from 4 different icon types or 12 popular emojis
- **Full Editing**: Change name, color, and icon/emoji after creation
- **Smart Deletion**: Prevents deletion of the last category

### Todo System
- **Auto-completion**: Todos are automatically archived when completed
- **Inline Editing**: Edit todos directly in the list
- **Smart Sorting**: Incomplete todos appear first, then sorted by creation date

### Data Persistence
- All data is automatically saved to browser's localStorage
- Graceful error handling if localStorage is unavailable
- State validation on app startup

## Browser Support

This app works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- localStorage API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License. 