import { create } from 'zustand';

interface ResetPassPopupState {
  isOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
}

export const useResetPassPopupStore = create<ResetPassPopupState>((set) => ({
  isOpen: false,
  openPopup: () => set({ isOpen: true }),
  closePopup: () => set({ isOpen: false }),
})); 