import { getCurrentUser } from 'aws-amplify/auth';
import { create } from 'zustand';
import { useDiaryStore } from './diaryStore';

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  setIsLoggedIn: (value: boolean) => void;
  setUserId: (userId: string | null) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;

  hasTakenDailyPhotoToday: boolean;
  checkDailyPhotoStatus: () => boolean;
}

export const useAuthStore = create<AuthState>()(set => ({
  isLoggedIn: false,
  userId: null,
  setIsLoggedIn: value => set({ isLoggedIn: value }),
  setUserId: userId => set({ userId }),
  logout: () => set({ isLoggedIn: false, userId: null }),

  initializeAuth: async () => {
    try {
      const user = await getCurrentUser();
      if (user.userId) {
        set({ isLoggedIn: true, userId: user.userId });
      }
    } catch (err) {
      set({ isLoggedIn: false, userId: null });
    }
  },

  hasTakenDailyPhotoToday: false,
  checkDailyPhotoStatus: () => {
    const diary = useDiaryStore.getState().diary;
    const hasPhoto = Boolean(diary?.picture_name);
    set({ hasTakenDailyPhotoToday: hasPhoto });
    return hasPhoto;
  },
}));
