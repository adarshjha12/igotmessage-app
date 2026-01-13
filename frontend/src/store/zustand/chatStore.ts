import { create } from "zustand";

interface UIState {
  isFileUploaded: boolean;
  isFileUploading: boolean;
  mainFile: File | null;
  filePreview: string | null;
  aiChatSuggestions: string;
  sendingMesaageToAi: boolean

  setAiChatSuggestions: (suggestion: string) => void;
  setFileUploaded: () => void;
  setMainFile: (file: File | null) => void;
  setFilePreview: (url: string | null) => void;
  removeFilePreview: () => void;
  setIsFileuploading: (val: boolean) => void;
  setSendingMessageToAi: (val:  boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  aiChatSuggestions: "",
  isFileUploaded: false,
  isFileUploading: false,
  mainFile: null,
  filePreview: null,
  sendingMesaageToAi: false,

  setFileUploaded: () => {
    set({ isFileUploaded: true }),
      setTimeout(() => {
        set({ isFileUploaded: false });
      }, 3000);
  },

  setAiChatSuggestions: (suggestion: string) =>
    set((s) => ({ aiChatSuggestions: suggestion })),

  setMainFile: (file: File | null) => set((s) => ({ mainFile: file })),

  setFilePreview: (url: string | null) => set((s) => ({ filePreview: url })),

  removeFilePreview: () => set((s) => ({ filePreview: null })),


  setIsFileuploading: (val: boolean) => set((s) => ({ isFileUploading: val })),

  setSendingMessageToAi: (val: boolean) => set((s) => ({ sendingMesaageToAi: val }))
}));
