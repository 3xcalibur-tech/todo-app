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

    const [dropLinePosition, setDropLinePosition] = useState<{
      todoId: string;
      position: "above" | "below";
    } | null>(null);
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

    const handleDropLineUpdate = (
      todoId: string,
      position: "above" | "below"
    ) => {
      setDropLinePosition({ todoId, position });
    };

    const handleDropLineClear = () => {
      setDropLinePosition(null);
    };

    const handleReorder = (
      draggedTodoId: string,
      targetTodoId: string,
      insertPosition: "above" | "below"
    ) => {
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

      // Calculate insertion index based on position
      let insertIndex = targetIndex;
      if (draggedIndex < targetIndex && insertPosition === "below") {
        insertIndex = targetIndex; // Insert after target (but account for removed item)
      } else if (draggedIndex < targetIndex && insertPosition === "above") {
        insertIndex = targetIndex - 1; // Insert before target (but account for removed item)
      } else if (draggedIndex > targetIndex && insertPosition === "below") {
        insertIndex = targetIndex + 1; // Insert after target
      } else if (draggedIndex > targetIndex && insertPosition === "above") {
        insertIndex = targetIndex; // Insert before target
      }

      reorderedTodos.splice(insertIndex, 0, draggedTodo);

      // Get the new order of todo IDs
      const newTodoIds = reorderedTodos.map((todo) => todo.id);

      reorderTodos(state.selectedCategoryId, newTodoIds);
      setDropLinePosition(null);
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
          className="flex-1 overflow-y-auto px-4 py-6"
          onDragLeave={(e) => {
            // Clear drop line if we're leaving the container entirely
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setDropLinePosition(null);
            }
          }}
          onDrop={() => {
            setDropLinePosition(null);
          }}
        >
          {sortedTodos.length > 0 ? (
            <div>
              {sortedTodos.map((todo, index) => (
                <div key={todo.id} className="relative">
                  {/* Drop line above */}
                  {dropLinePosition?.todoId === todo.id &&
                    dropLinePosition.position === "above" && (
                      <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full z-50 shadow-lg">
                        <div className="absolute -left-1 -top-1 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                        <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                      </div>
                    )}

                  <TodoItem
                    todo={todo}
                    isEditing={todo.id === editingTodoId}
                    onStartEditing={() => setEditingTodoId(todo.id)}
                    onStopEditing={() => setEditingTodoId(null)}
                    onReorder={handleReorder}
                    onDropLineUpdate={handleDropLineUpdate}
                    onDropLineClear={handleDropLineClear}
                    canDrag={!todo.completed && !state.showArchived}
                    delay={index * 0.05}
                  />

                  {/* Drop line below */}
                  {dropLinePosition?.todoId === todo.id &&
                    dropLinePosition.position === "below" && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full z-50 shadow-lg">
                        <div className="absolute -left-1 -top-1 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                        <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                      </div>
                    )}
                </div>
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
