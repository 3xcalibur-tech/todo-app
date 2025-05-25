import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Todo } from "../types";
import { TodoItem } from "./TodoItem";
import { TodoForm, TodoFormRef } from "./TodoForm";
import { ArchiveIcon, ArrowLeftIcon } from "lucide-react";

interface TodoListProps {
  todoFormRef?: React.RefObject<TodoFormRef>;
}

export const TodoList: React.FC<TodoListProps> = React.memo(
  ({ todoFormRef: externalTodoFormRef }) => {
    const { state, toggleArchiveView, reorderTodos } = useAppContext();
    const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const todoFormRef = useRef<TodoFormRef>(null);

    // Use external ref if provided, otherwise use local ref
    const activeFormRef = externalTodoFormRef || todoFormRef;

    const selectedCategory = state.selectedCategoryId
      ? state.categories.find((cat) => cat.id === state.selectedCategoryId)
      : null;

    const filteredTodos = state.todos.filter(
      (todo) =>
        todo.categoryId === state.selectedCategoryId &&
        todo.archived === state.showArchived
    );

    // Sort todos: incomplete first by order, then completed by creation date (newest first)
    const sortedTodos = [...filteredTodos].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (!a.completed && !b.completed) {
        // Both incomplete: sort by order
        return (a.order || 0) - (b.order || 0);
      }
      // Both completed: sort by creation date (newest first)
      return b.createdAt - a.createdAt;
    });

    const getEmptyStateMessage = () => {
      if (state.showArchived) {
        return "No archived todos yet";
      }
      return "No todos yet. Add one below!";
    };

    const handleReorder = (draggedTodoId: string, targetTodoId: string) => {
      if (!state.selectedCategoryId || draggedTodoId === targetTodoId) return;

      const incompleteTodos = sortedTodos.filter((todo) => !todo.completed);
      const draggedIndex = incompleteTodos.findIndex(
        (todo) => todo.id === draggedTodoId
      );
      const targetIndex = incompleteTodos.findIndex(
        (todo) => todo.id === targetTodoId
      );

      if (draggedIndex === -1 || targetIndex === -1) return;

      // Create new array with reordered todos
      const reorderedTodos = [...incompleteTodos];
      const [draggedTodo] = reorderedTodos.splice(draggedIndex, 1);
      reorderedTodos.splice(targetIndex, 0, draggedTodo);

      // Get the new order of todo IDs
      const newTodoIds = reorderedTodos.map((todo) => todo.id);

      reorderTodos(state.selectedCategoryId, newTodoIds);
    };

    return (
      <motion.div
        className="flex-1 flex flex-col h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center">
            {state.showArchived && (
              <motion.button
                className="mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleArchiveView}
              >
                <ArrowLeftIcon
                  size={16}
                  className="text-gray-600 dark:text-gray-400"
                />
              </motion.button>
            )}
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {state.showArchived ? (
                <span className="flex items-center">
                  <ArchiveIcon size={18} className="mr-2" />
                  Archive - {selectedCategory?.name}
                </span>
              ) : (
                selectedCategory?.name
              )}
            </h1>
          </div>
        </div>

        <div
          className={`flex-1 overflow-y-auto px-4 py-6 transition-colors duration-200 ${
            isDragActive ? "bg-blue-50 dark:bg-blue-900/10" : ""
          }`}
          onDragEnter={() => setIsDragActive(true)}
          onDragLeave={(e) => {
            // Only set to false if we're leaving the container entirely
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsDragActive(false);
            }
          }}
          onDrop={() => setIsDragActive(false)}
        >
          {sortedTodos.length > 0 ? (
            <div>
              {sortedTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isEditing={todo.id === editingTodoId}
                  onStartEditing={() => setEditingTodoId(todo.id)}
                  onStopEditing={() => setEditingTodoId(null)}
                  onReorder={handleReorder}
                  canDrag={!todo.completed && !state.showArchived}
                  delay={index * 0.05}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              <p className="text-base">{getEmptyStateMessage()}</p>
            </div>
          )}
        </div>

        {/* TodoForm stays persistent - only hide in archive view */}
        {!state.showArchived && state.selectedCategoryId && (
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <TodoForm ref={activeFormRef} />
          </div>
        )}
      </motion.div>
    );
  }
);
