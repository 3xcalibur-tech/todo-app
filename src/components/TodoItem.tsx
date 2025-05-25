import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Todo } from "../types";
import { CheckIcon, TrashIcon, GripVerticalIcon } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onReorder?: (
    draggedTodoId: string,
    targetTodoId: string,
    insertPosition: "above" | "below"
  ) => void;
  onDropLineUpdate?: (todoId: string, position: "above" | "below") => void;
  onDropLineClear?: () => void;
  canDrag?: boolean;
  delay?: number;
}

export const TodoItem: React.FC<TodoItemProps> = React.memo(
  ({
    todo,
    isEditing,
    onStartEditing,
    onStopEditing,
    onReorder,
    onDropLineUpdate,
    onDropLineClear,
    canDrag = false,
    delay = 0,
  }) => {
    const {
      state,
      toggleTodo,
      deleteTodo,
      archiveTodo,
      unarchiveTodo,
      editTodo,
    } = useAppContext();
    const [editValue, setEditValue] = useState(todo.title);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const archiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        setIsHovered(false); // Hide drag handle when editing
      }
    }, [isEditing]);

    // Cleanup timeout on unmount and reset hover state when todo is completed
    useEffect(() => {
      if (todo.completed) {
        setIsHovered(false);
      }

      return () => {
        if (archiveTimeoutRef.current) {
          clearTimeout(archiveTimeoutRef.current);
        }
      };
    }, [todo.completed]);

    const handleToggle = () => {
      toggleTodo(todo.id);

      // Clear any existing archive timeout
      if (archiveTimeoutRef.current) {
        clearTimeout(archiveTimeoutRef.current);
        archiveTimeoutRef.current = null;
      }

      // If we're in archive view and unchecking a completed todo, unarchive it
      if (state.showArchived && todo.completed) {
        unarchiveTodo(todo.id);
      }
      // If we're in normal view and completing a todo, archive it after delay
      else if (!state.showArchived && !todo.completed) {
        archiveTimeoutRef.current = setTimeout(() => {
          archiveTodo(todo.id);
          archiveTimeoutRef.current = null;
        }, 3000);
      }
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteTodo(todo.id);
    };

    const handleTextClick = () => {
      if (!todo.completed && !isEditing) {
        onStartEditing();
      }
    };

    const handleEditSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editValue.trim()) {
        editTodo(todo.id, editValue);
        onStopEditing();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditValue(todo.title);
        onStopEditing();
      }
    };

    // Drag handlers
    const handleDragStart = (e: React.DragEvent) => {
      if (!canDrag) {
        e.preventDefault();
        return;
      }
      setIsDragging(true);
      setIsHovered(false); // Hide drag handle during drag
      e.dataTransfer.setData("text/plain", todo.id);
      e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      onDropLineClear?.();
    };

    const handleDragOver = (e: React.DragEvent) => {
      if (!canDrag || !onDropLineUpdate) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      // Calculate if we're in the top or bottom half of the element
      const rect = e.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const position = e.clientY < midY ? "above" : "below";

      onDropLineUpdate(todo.id, position);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      // Only clear if we're leaving the element entirely
      const rect = e.currentTarget.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        onDropLineClear?.();
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      onDropLineClear?.();

      if (!canDrag || !onReorder) return;

      const draggedTodoId = e.dataTransfer.getData("text/plain");
      if (draggedTodoId !== todo.id) {
        // Calculate drop position
        const rect = e.currentTarget.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const position = e.clientY < midY ? "above" : "below";

        onReorder(draggedTodoId, todo.id, position);
      }
    };

    return (
      <motion.div
        className={`group mb-3 rounded-xl bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden todo-item transition-all duration-200
                 ${todo.completed ? "opacity-70" : ""}
                 ${
                   isDragging
                     ? "opacity-80 shadow-2xl z-50 ring-2 ring-blue-400 ring-opacity-50"
                     : ""
                 }
                 ${
                   canDrag && !todo.completed
                     ? "hover:shadow-md cursor-grab active:cursor-grabbing"
                     : ""
                 }`}
        initial={false}
        animate={{
          opacity: isDragging ? 0.85 : 1,
          y: 0,
          scale: isDragging ? 1.02 : 1,
        }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{
          duration: 0.15,
          ease: "easeOut",
        }}
        draggable={canDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isEditing ? (
          <div className="p-4">
            <form onSubmit={handleEditSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (editValue.trim()) {
                    editTodo(todo.id, editValue);
                  } else {
                    setEditValue(todo.title);
                  }
                  onStopEditing();
                }}
                className="w-full px-0 py-2 text-base border-none focus:outline-none focus:ring-0 bg-transparent text-gray-800 dark:text-gray-100"
                style={{ fontSize: "16px" }}
              />
            </form>
          </div>
        ) : (
          <div className="flex items-center p-4 min-h-[60px]">
            {/* Drag handle - only show for incomplete todos when dragging is enabled */}
            {canDrag && !todo.completed && (
              <div
                className={`flex-shrink-0 w-6 h-6 mr-3 flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200 ${
                  isHovered && !isDragging && !isEditing
                    ? "opacity-100 text-gray-600 dark:text-gray-300"
                    : "opacity-0 text-gray-400 dark:text-gray-500"
                }`}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  pointerEvents:
                    isHovered && !isDragging && !isEditing ? "auto" : "none",
                }}
              >
                <GripVerticalIcon size={16} />
              </div>
            )}

            <motion.button
              className={`flex-shrink-0 w-6 h-6 rounded-full mr-4 flex items-center justify-center ${
                todo.completed
                  ? "bg-green-500 text-white border-2 border-green-500"
                  : "border-2 border-gray-300 dark:border-gray-500 hover:border-blue-400 dark:hover:border-blue-400"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggle}
            >
              {todo.completed && <CheckIcon size={14} />}
            </motion.button>

            <div
              className={`flex-1 text-base leading-relaxed cursor-pointer ${
                todo.completed
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
              onClick={handleTextClick}
            >
              {todo.title}
            </div>

            <motion.button
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ml-3 opacity-0 group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
            >
              <TrashIcon size={16} />
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  }
);
