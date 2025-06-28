import { create } from 'zustand';

type SettingPopupContent = 'change_role' | 'user_name' | 'pet_name' | 'avatar' | 'parent_password';

interface SettingPopupState {
  isOpen: boolean;
  content: SettingPopupContent;
  openPopup: () => void;
  closePopup: () => void;
  setContent: (content: SettingPopupContent) => void;
}

export const useSettingPopupStore = create<SettingPopupState>(set => ({
  isOpen: false,
  content: 'change_role',
  openPopup: () => set({ isOpen: true }),
  closePopup: () => set({ isOpen: false }),
  setContent: content => set({ content }),
}));
