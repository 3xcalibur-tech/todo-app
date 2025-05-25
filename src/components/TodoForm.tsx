import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { PlusIcon } from "lucide-react";

interface TodoFormProps {
  initialText?: string;
  onInitialTextProcessed?: () => void;
}

export interface TodoFormRef {
  focusInput: () => void;
  appendText: (text: string) => void;
}

export const TodoForm = React.forwardRef<TodoFormRef, TodoFormProps>(
  ({ initialText = "", onInitialTextProcessed }, ref) => {
    const { addTodo } = useAppContext();
    const [title, setTitle] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle initial text from global typing
    useEffect(() => {
      if (initialText) {
        setTitle(initialText);
        inputRef.current?.focus();
        onInitialTextProcessed?.();
      }
    }, [initialText, onInitialTextProcessed]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (title.trim()) {
        addTodo(title.trim());
        setTitle("");
      }
    };

    // Focus input when receiving initial text
    const focusInput = () => {
      inputRef.current?.focus();
    };

    // Append text to current input
    const appendText = (text: string) => {
      setTitle((prev) => prev + text);
      focusInput();
    };

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      focusInput,
      appendText,
    }));

    // Handle keyboard shortcut (Cmd/Ctrl+N) to focus the input
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Check for Cmd+N (Mac) or Ctrl+N (Windows)
        if ((e.metaKey || e.ctrlKey) && e.key === "n") {
          e.preventDefault();
          focusInput();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
      <form
        onSubmit={handleSubmit}
        className={`flex items-center rounded-xl border-2 bg-white dark:bg-gray-700 ${
          isFocused
            ? "border-blue-400 dark:border-blue-500 shadow-sm"
            : "border-gray-200 dark:border-gray-600"
        } overflow-hidden`}
      >
        <button
          type="submit"
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:scale-105 active:scale-95"
          disabled={!title.trim()}
        >
          <PlusIcon
            size={18}
            className={
              title.trim()
                ? "text-blue-500 dark:text-blue-400"
                : "text-gray-400 dark:text-gray-500"
            }
          />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Add a new todo... (⌘N)"
          className="flex-1 py-3 pr-4 text-base focus:outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          style={{ fontSize: "16px" }}
        />
      </form>
    );
  }
);
