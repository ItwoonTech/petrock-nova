import { create } from 'zustand';

type ImageGenPopupContent = 'inputName' | 'chooseIcon' | 'loading';

interface ImageGenPopupState {
  isOpen: boolean;
  targetPath: string | null;
  content: ImageGenPopupContent;
  openPopup: (path?: string) => void;
  closePopup: () => void;
  setTargetPath: (path: string) => void;
  setContent: (content: ImageGenPopupContent) => void;
}

export const useImageGenPopupStore = create<ImageGenPopupState>(set => ({
  isOpen: false,
  targetPath: null,
  content: 'chooseIcon',
  openPopup: path => set({ isOpen: true, targetPath: path || null, content: 'chooseIcon' }),
  closePopup: () => set({ isOpen: false, targetPath: null, content: 'chooseIcon' }),
  setTargetPath: path => set({ targetPath: path }),
  setContent: content => set({ content }),
}));
