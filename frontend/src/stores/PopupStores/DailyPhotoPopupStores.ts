import { create } from 'zustand';

type DailyPhotoPopupContent = 'inputPass' | 'checkPhoto';

interface DailyPhotoPopupState {
  isOpen: boolean;
  content: DailyPhotoPopupContent;
  capturedImage: string | null;
  openPopup: () => void;
  closePopup: () => void;
  setCapturedImage: (image: string | null) => void;
  setContent: (content: DailyPhotoPopupContent) => void;
}

export const useDailyPhotoPopupStore = create<DailyPhotoPopupState>((set) => ({
  isOpen: false,
  content: 'inputPass',
  capturedImage: null,
  openPopup: () => set({ isOpen: true }),
  closePopup: () => set({ isOpen: false }),
  setCapturedImage: (image) => set({ capturedImage: image }),
  setContent: (content) => set({ content }),
})); 