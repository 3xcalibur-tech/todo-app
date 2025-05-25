import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import {
  PencilIcon,
  ListChecksIcon,
  ClipboardListIcon,
  BookmarkIcon,
  X as XIcon,
} from "lucide-react";

interface CategoryFormProps {
  categoryId?: string | null;
  onClose: () => void;
}

const COLORS = [
  "#FF2D55", // Pink
  "#FF9500", // Orange
  "#FFCC00", // Yellow
  "#34C759", // Green
  "#5AC8FA", // Light Blue
  "#007AFF", // Blue
  "#5856D6", // Purple
  "#AF52DE", // Magenta
];

const ICONS = [
  { id: "PencilIcon", component: <PencilIcon size={16} />, type: "icon" },
  {
    id: "ListChecksIcon",
    component: <ListChecksIcon size={16} />,
    type: "icon",
  },
  {
    id: "ClipboardListIcon",
    component: <ClipboardListIcon size={16} />,
    type: "icon",
  },
  { id: "BookmarkIcon", component: <BookmarkIcon size={16} />, type: "icon" },
];

const EMOJIS = [
  { id: "📝", component: "📝", type: "emoji" },
  { id: "💼", component: "💼", type: "emoji" },
  { id: "🛒", component: "🛒", type: "emoji" },
  { id: "🎯", component: "🎯", type: "emoji" },
  { id: "🏠", component: "🏠", type: "emoji" },
  { id: "💪", component: "💪", type: "emoji" },
  { id: "📚", component: "📚", type: "emoji" },
  { id: "🎨", component: "🎨", type: "emoji" },
  { id: "🍕", component: "🍕", type: "emoji" },
  { id: "✈️", component: "✈️", type: "emoji" },
  { id: "🎵", component: "🎵", type: "emoji" },
  { id: "⚽", component: "⚽", type: "emoji" },
];

const ALL_ICONS = [...ICONS, ...EMOJIS];

export const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryId,
  onClose,
}) => {
  const { state, addCategory, renameCategory, updateCategory } =
    useAppContext();
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState("PencilIcon");
  const [iconType, setIconType] = useState<"icons" | "emojis">("icons");

  useEffect(() => {
    if (categoryId) {
      const category = state.categories.find((c) => c.id === categoryId);
      if (category) {
        setName(category.name);
        setColor(category.color);
        setIcon(category.icon);
        // Determine if the current icon is an emoji or icon
        const isEmoji = EMOJIS.some((emoji) => emoji.id === category.icon);
        setIconType(isEmoji ? "emojis" : "icons");
      }
    }
  }, [categoryId, state.categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim()) {
      if (categoryId) {
        updateCategory(categoryId, name, color, icon);
      } else {
        addCategory(name, color, icon);
      }
      onClose();
    }
  };

  const currentIcons = iconType === "icons" ? ICONS : EMOJIS;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {categoryId ? "Edit Category" : "New Category"}
          </h3>
          <button
            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
            onClick={onClose}
          >
            <XIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full ${
                    color === c ? "ring-2 ring-offset-2 ring-blue-500" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>

            {/* Icon Type Toggle */}
            <div className="flex mb-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  iconType === "icons"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                onClick={() => {
                  setIconType("icons");
                  if (iconType === "emojis") {
                    setIcon("PencilIcon"); // Reset to default icon
                  }
                }}
              >
                Icons
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  iconType === "emojis"
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
                onClick={() => {
                  setIconType("emojis");
                  if (iconType === "icons") {
                    setIcon("📝"); // Reset to default emoji
                  }
                }}
              >
                Emojis
              </button>
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-6 gap-2">
              {currentIcons.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  className={`flex items-center justify-center w-12 h-12 border rounded-md transition-colors ${
                    icon === i.id
                      ? "bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500"
                      : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setIcon(i.id)}
                >
                  {i.type === "emoji" ? (
                    <span className="text-lg">{i.component}</span>
                  ) : (
                    <div className="text-gray-600 dark:text-gray-300">
                      {i.component}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <motion.button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={!name.trim()}
            >
              {categoryId ? "Save" : "Create"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
