import { create } from 'zustand';

interface UIStore {
  // Modal states
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  
  // Loading states
  isLoading: boolean;
  loadingMessage: string | null;
  
  // Sidebar state (for mobile)
  isSidebarOpen: boolean;
  
  // Actions
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isModalOpen: false,
  modalContent: null,
  isLoading: false,
  loadingMessage: null,
  isSidebarOpen: false,

  openModal: (content) => {
    set({ isModalOpen: true, modalContent: content });
  },

  closeModal: () => {
    set({ isModalOpen: false, modalContent: null });
  },

  setLoading: (isLoading, message) => {
    set({ isLoading, loadingMessage: message || null });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (isOpen) => {
    set({ isSidebarOpen: isOpen });
  },
}));
