import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { PlusIcon } from "lucide-react";

export const TodoForm: React.FC = () => {
  const { addTodo } = useAppContext();
  const [title, setTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTodo(title.trim());
      setTitle("");
    }
  };

  // Handle keyboard shortcut (Cmd/Ctrl+N) to focus the input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+N (Mac) or Ctrl+N (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        inputRef.current?.focus();
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
};
