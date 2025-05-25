export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string;
  archived: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export type AppState = {
  categories: Category[];
  todos: Todo[];
  selectedCategoryId: string | null;
  showArchived: boolean;
  theme: "light" | "dark";
};

export type AppAction =
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "SELECT_CATEGORY"; payload: string }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "TOGGLE_TODO"; payload: string }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "ARCHIVE_TODO"; payload: string }
  | { type: "UNARCHIVE_TODO"; payload: string }
  | { type: "TOGGLE_ARCHIVE_VIEW" }
  | { type: "RENAME_CATEGORY"; payload: { id: string; name: string } }
  | {
      type: "UPDATE_CATEGORY";
      payload: { id: string; name: string; color: string; icon: string };
    }
  | { type: "EDIT_TODO"; payload: { id: string; title: string } }
  | { type: "SET_THEME"; payload: "light" | "dark" };
