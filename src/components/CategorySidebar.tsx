import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import {
  PlusIcon,
  ArchiveIcon,
  PencilIcon,
  ListChecksIcon,
  ClipboardListIcon,
  BookmarkIcon,
  TrashIcon,
  MoreHorizontalIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react";
import { CategoryForm } from "./CategoryForm";

const iconMap: Record<string, React.ReactNode> = {
  PencilIcon: <PencilIcon size={16} />,
  ListChecksIcon: <ListChecksIcon size={16} />,
  ClipboardListIcon: <ClipboardListIcon size={16} />,
  BookmarkIcon: <BookmarkIcon size={16} />,
};

// Function to check if an icon is an emoji
const isEmoji = (icon: string) => {
  // Check if the icon is not in the predefined icon map (meaning it's likely an emoji)
  return !iconMap[icon];
};

// Function to render icon or emoji
const renderIcon = (icon: string) => {
  if (isEmoji(icon)) {
    return <span className="text-sm">{icon}</span>;
  }
  return iconMap[icon] || <PencilIcon size={16} />;
};

// Theme toggle component
const ThemeToggle: React.FC = () => {
  const { state, toggleTheme } = useAppContext();

  const getThemeIcon = () => {
    return state.theme === "light" ? (
      <SunIcon size={16} />
    ) : (
      <MoonIcon size={16} />
    );
  };

  const getThemeLabel = () => {
    return state.theme === "light" ? "Light" : "Dark";
  };

  return (
    <motion.button
      className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-gray-700"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleTheme}
      title={`Switch to ${state.theme === "light" ? "Dark" : "Light"} theme`}
    >
      <div className="w-6 h-6 rounded-md flex items-center justify-center mr-3 bg-gray-200 dark:bg-gray-600">
        <div className="text-gray-600 dark:text-gray-300">{getThemeIcon()}</div>
      </div>
      <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
        {getThemeLabel()} Theme
      </span>
    </motion.button>
  );
};

export const CategorySidebar: React.FC = () => {
  const { state, selectCategory, toggleArchiveView, deleteCategory } =
    useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCategoryMenuOpen(null);
      }
    };

    if (categoryMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [categoryMenuOpen]);

  const handleCategoryClick = (id: string) => {
    selectCategory(id);
    setCategoryMenuOpen(null);
  };

  const handleArchiveClick = () => {
    toggleArchiveView();
    setCategoryMenuOpen(null);
  };

  const toggleCategoryMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoryMenuOpen(categoryMenuOpen === id ? null : id);
  };

  const handleDeleteCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Prevent deleting the last category
    if (state.categories.length <= 1) {
      alert(
        "You cannot delete the last category. Create another category first."
      );
      setCategoryMenuOpen(null);
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this category? All todos in this category will also be deleted."
      )
    ) {
      deleteCategory(categoryId);
    }
    setCategoryMenuOpen(null);
  };

  return (
    <motion.div
      ref={sidebarRef}
      className="min-w-fit max-w-sm h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
          Categories
        </h2>
        <motion.button
          className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center"
          whileHover={{
            scale: 1.05,
            backgroundColor: state.isDarkMode ? "#374151" : "#f3f4f6",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
        >
          <PlusIcon size={14} />
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col">
        {state.categories.map((category, index) => (
          <motion.div
            key={category.id}
            className={`flex items-center justify-between p-3 mb-1 rounded-lg cursor-pointer relative ${
              state.selectedCategoryId === category.id
                ? "bg-white dark:bg-gray-700 shadow-sm"
                : "hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category.id)}
            style={{ zIndex: categoryMenuOpen === category.id ? 50 : 1 }}
          >
            <div className="flex items-center">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center mr-3"
                style={{ backgroundColor: category.color }}
              >
                {renderIcon(category.icon)}
              </div>
              <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                {category.name}
              </span>
            </div>
            <motion.button
              className="w-6 h-6 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
              whileHover={{ scale: 1.1 }}
              onClick={(e) => toggleCategoryMenu(category.id, e)}
            >
              <MoreHorizontalIcon size={14} />
            </motion.button>

            <AnimatePresence>
              {categoryMenuOpen === category.id && (
                <motion.div
                  className={`absolute bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 w-32 border border-gray-200 dark:border-gray-600 ${
                    index >= state.categories.length - 2
                      ? "bottom-full mb-1 right-0"
                      : "top-full mt-1 right-0"
                  }`}
                  style={{ zIndex: 1000 }}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                    y: index >= state.categories.length - 2 ? 5 : -5,
                  }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    y: index >= state.categories.length - 2 ? 5 : -5,
                  }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(category.id);
                      setCategoryMenuOpen(null);
                    }}
                  >
                    <PencilIcon size={14} className="mr-2" /> Edit
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                    onClick={(e) => handleDeleteCategory(category.id, e)}
                  >
                    <TrashIcon size={14} className="mr-2" /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        className={`flex items-center p-3 rounded-lg cursor-pointer mt-2 ${
          state.showArchived
            ? "bg-white dark:bg-gray-700 shadow-sm"
            : "hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleArchiveClick}
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center mr-3 bg-gray-200 dark:bg-gray-600">
          <ArchiveIcon size={14} className="text-gray-600 dark:text-gray-300" />
        </div>
        <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
          Archive
        </span>
      </motion.div>

      {/* Theme Toggle */}
      <ThemeToggle />

      <AnimatePresence>
        {showForm && <CategoryForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {editingCategory && (
          <CategoryForm
            categoryId={editingCategory}
            onClose={() => setEditingCategory(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
