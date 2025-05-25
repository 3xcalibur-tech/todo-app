import React, { useRef } from "react";
import { motion } from "framer-motion";
import { AppProvider, useAppContext } from "./context/AppContext";
import { CategorySidebar } from "./components/CategorySidebar";
import { TodoList } from "./components/TodoList";
import { TodoFormRef } from "./components/TodoForm";
import { useGlobalTyping } from "./hooks/useGlobalTyping";

const AppContent: React.FC = () => {
  const { state } = useAppContext();
  const todoFormRef = useRef<TodoFormRef>(null);

  const handleTypingStart = (text: string) => {
    // Only trigger if we're not in archive view and have a selected category
    if (!state.showArchived && state.selectedCategoryId) {
      todoFormRef.current?.appendText(text);
    }
  };

  // Enable global typing only when not in archive mode and has selected category
  useGlobalTyping({
    onTypingStart: handleTypingStart,
    enabled: !state.showArchived && !!state.selectedCategoryId,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col text-gray-800 dark:text-gray-100 font-['SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']">
        {/* Header */}
        <motion.header
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Todo
          </h1>
        </motion.header>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          <CategorySidebar />
          <TodoList todoFormRef={todoFormRef} />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
