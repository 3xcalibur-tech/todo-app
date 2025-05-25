import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { nanoid } from "nanoid";
import { AppState, AppAction, Category } from "../types";
import {
  PencilIcon,
  ListChecksIcon,
  ClipboardListIcon,
  BookmarkIcon,
} from "lucide-react";

const defaultCategories: Category[] = [
  {
    id: "personal",
    name: "Personal",
    color: "#FF2D55",
    icon: "PencilIcon",
  },
  {
    id: "work",
    name: "Work",
    color: "#007AFF",
    icon: "ListChecksIcon",
  },
  {
    id: "shopping",
    name: "Shopping",
    color: "#5AC8FA",
    icon: "ClipboardListIcon",
  },
  {
    id: "goals",
    name: "Goals",
    color: "#34C759",
    icon: "BookmarkIcon",
  },
];

const initialState: AppState = {
  categories: defaultCategories,
  todos: [],
  selectedCategoryId: "personal",
  showArchived: false,
  theme: "light", // Will be set based on system preference
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.payload
        ),
        todos: state.todos.filter((todo) => todo.categoryId !== action.payload),
        selectedCategoryId:
          state.selectedCategoryId === action.payload
            ? state.categories.length > 1
              ? state.categories[0].id
              : null
            : state.selectedCategoryId,
      };
    case "SELECT_CATEGORY":
      return {
        ...state,
        selectedCategoryId: action.payload,
        showArchived: false,
      };
    case "ADD_TODO":
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "ARCHIVE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, archived: true } : todo
        ),
      };
    case "UNARCHIVE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, archived: false } : todo
        ),
      };
    case "TOGGLE_ARCHIVE_VIEW":
      return {
        ...state,
        showArchived: !state.showArchived,
      };
    case "RENAME_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id
            ? { ...category, name: action.payload.name }
            : category
        ),
      };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id
            ? {
                ...category,
                name: action.payload.name,
                color: action.payload.color,
                icon: action.payload.icon,
              }
            : category
        ),
      };
    case "EDIT_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, title: action.payload.title }
            : todo
        ),
      };
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addCategory: (name: string, color: string, icon: string) => void;
  deleteCategory: (id: string) => void;
  selectCategory: (id: string) => void;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  archiveTodo: (id: string) => void;
  unarchiveTodo: (id: string) => void;
  toggleArchiveView: () => void;
  renameCategory: (id: string, name: string) => void;
  updateCategory: (
    id: string,
    name: string,
    color: string,
    icon: string
  ) => void;
  editTodo: (id: string, title: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Try to load state from localStorage with error handling
  const getInitialState = () => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    try {
      const savedState = localStorage.getItem("todoAppState");
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Validate that the parsed state has the required structure
        if (
          parsed.categories &&
          parsed.todos &&
          Array.isArray(parsed.categories) &&
          Array.isArray(parsed.todos)
        ) {
          // If no theme is saved, use system preference
          if (
            !parsed.theme ||
            (parsed.theme !== "light" && parsed.theme !== "dark")
          ) {
            parsed.theme = systemPrefersDark ? "dark" : "light";
          }
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Failed to load saved state from localStorage:", error);
    }

    // Return initial state with system preference
    return {
      ...initialState,
      theme: systemPrefersDark ? "dark" : "light",
    };
  };

  const [state, dispatch] = useReducer(appReducer, getInitialState());

  // Derive isDarkMode from theme
  const isDarkMode = state.theme === "dark";

  // Apply dark class to document - only when theme changes
  useEffect(() => {
    const root = document.documentElement;
    // Add immediate class to prevent transitions during theme change
    root.classList.add("theme-immediate");

    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Remove immediate class after a frame to re-enable transitions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove("theme-immediate");
      });
    });
  }, [isDarkMode]);

  // Save state to localStorage - debounced to avoid excessive writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem("todoAppState", JSON.stringify(state));
      } catch (error) {
        console.warn("Failed to save state to localStorage:", error);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Memoize all action functions to prevent unnecessary re-renders
  const addCategory = useCallback(
    (name: string, color: string, icon: string) => {
      dispatch({
        type: "ADD_CATEGORY",
        payload: {
          id: nanoid(),
          name,
          color,
          icon,
        },
      });
    },
    []
  );

  const deleteCategory = useCallback((id: string) => {
    dispatch({
      type: "DELETE_CATEGORY",
      payload: id,
    });
  }, []);

  const selectCategory = useCallback((id: string) => {
    dispatch({
      type: "SELECT_CATEGORY",
      payload: id,
    });
  }, []);

  const addTodo = useCallback(
    (title: string) => {
      if (!state.selectedCategoryId) return;

      dispatch({
        type: "ADD_TODO",
        payload: {
          id: nanoid(),
          title,
          completed: false,
          categoryId: state.selectedCategoryId,
          archived: false,
          createdAt: Date.now(),
        },
      });
    },
    [state.selectedCategoryId]
  );

  const toggleTodo = useCallback((id: string) => {
    dispatch({
      type: "TOGGLE_TODO",
      payload: id,
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({
      type: "DELETE_TODO",
      payload: id,
    });
  }, []);

  const archiveTodo = useCallback((id: string) => {
    dispatch({
      type: "ARCHIVE_TODO",
      payload: id,
    });
  }, []);

  const unarchiveTodo = useCallback((id: string) => {
    dispatch({
      type: "UNARCHIVE_TODO",
      payload: id,
    });
  }, []);

  const toggleArchiveView = useCallback(() => {
    dispatch({
      type: "TOGGLE_ARCHIVE_VIEW",
    });
  }, []);

  const renameCategory = useCallback((id: string, name: string) => {
    dispatch({
      type: "RENAME_CATEGORY",
      payload: { id, name },
    });
  }, []);

  const updateCategory = useCallback(
    (id: string, name: string, color: string, icon: string) => {
      dispatch({
        type: "UPDATE_CATEGORY",
        payload: { id, name, color, icon },
      });
    },
    []
  );

  const editTodo = useCallback((id: string, title: string) => {
    dispatch({
      type: "EDIT_TODO",
      payload: { id, title },
    });
  }, []);

  const setTheme = useCallback((theme: "light" | "dark") => {
    dispatch({
      type: "SET_THEME",
      payload: theme,
    });
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = state.theme === "light" ? "dark" : "light";
    dispatch({
      type: "SET_THEME",
      payload: nextTheme,
    });
  }, [state.theme]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      addCategory,
      deleteCategory,
      selectCategory,
      addTodo,
      toggleTodo,
      deleteTodo,
      archiveTodo,
      unarchiveTodo,
      toggleArchiveView,
      renameCategory,
      updateCategory,
      editTodo,
      setTheme,
      toggleTheme,
      isDarkMode,
    }),
    [
      state,
      addCategory,
      deleteCategory,
      selectCategory,
      addTodo,
      toggleTodo,
      deleteTodo,
      archiveTodo,
      unarchiveTodo,
      toggleArchiveView,
      renameCategory,
      updateCategory,
      editTodo,
      setTheme,
      toggleTheme,
      isDarkMode,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
