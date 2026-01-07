import { create } from "zustand";

interface UIState {
  theme: "light" | "dark";
  isSidebarOpen: boolean;
  storyViewer: {
    isOpen: boolean;
    initialIndex: number;
  };
  aiChatSuggestions: string;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleTheme: () => void;
  openStoryViewer: (index: number) => void;
  closeStoryViewer: () => void;
  setAiChatSuggestions: (suggestion: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "light",
  isSidebarOpen: false,
  aiChatSuggestions: "",
  storyViewer: {
    isOpen: false,
    initialIndex: 0,
  },

  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  openStoryViewer: (index) =>
    set({
      storyViewer: { isOpen: true, initialIndex: index },
    }),

  closeStoryViewer: () =>
    set({
      storyViewer: { isOpen: false, initialIndex: 0 },
    }),

  setAiChatSuggestions: (suggestion: string) =>
    set((s) => ({ aiChatSuggestions: suggestion })),
}));
