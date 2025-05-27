import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppProvider, useAppContext } from "./context/AppContext";
import { CategorySidebar } from "./components/CategorySidebar";
import { TodoList } from "./components/TodoList";
import { TodoFormRef } from "./components/TodoForm";
import { useGlobalTyping } from "./hooks/useGlobalTyping";

const AppContent: React.FC = () => {
  const { state } = useAppContext();
  const todoFormRef = useRef<TodoFormRef>(null);
  const [emailCopied, setEmailCopied] = useState(false);

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

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText("mikhail@smorchkov.online");
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

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

        {/* Footer */}
        <motion.footer
          className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-center relative">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Made with ❤️ by{" "}
              <button
                onClick={handleEmailClick}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 font-medium underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-pointer bg-transparent border-none p-0"
                title="Click to copy email"
              >
                mikhail@smorchkov.online
              </button>
            </p>

            {/* Copy success message */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 -top-12 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{
                opacity: emailCopied ? 1 : 0,
                y: emailCopied ? 0 : 10,
                scale: emailCopied ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "none" }}
            >
              📧 Email copied to clipboard!
            </motion.div>
          </div>
        </motion.footer>
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
