import { userApi } from '@/api/userApi';
import type { Pet } from '@/types/pet';
import type { CreateUser, UpdateUserName, UpdateUserPassword, User, UserRole } from '@/types/user';
import { create } from 'zustand';

interface SignupData {
  user_name: string;
  password: string;
  pet_id: string;
  pet?: Pet;
}

export interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  signupData: SignupData | null;

  // ユーザー情報の操作
  setUser: (user: User) => void;
  setUserBasicInfo: (userId: string, userName: string, userRole: UserRole) => void; //ユーザ名入力画面にてセット
  setUserId: (userId: string) => void;
  setUserName: (userName: string) => void;
  setUserRole: (userRole: UserRole) => void;
  setPassword: (password: string) => void;
  setPetId: (petId: string) => void;

  // サインアップ関連
  setSignupData: (data: Partial<SignupData>) => void;
  setPet: (pet: Pet) => void;
  setPetCategory: (category: string) => void;
  setPetImageName: (imageName: string) => void;
  clearSignupData: () => void;

  // API操作
  createUser: (userId: string, data: CreateUser) => Promise<void>;
  fetchUser: (userId: string) => Promise<void>;
  updateUserName: (userId: string, data: UpdateUserName) => Promise<void>;
  updateUserPassword: (userId: string, data: UpdateUserPassword) => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  loading: false,
  error: null,
  signupData: null,

  // ユーザー情報の操作
  setUser: user => set({ user }),
  setUserBasicInfo: (userId, userName, userRole) =>
    set(state => ({
      user: state.user
        ? {
            ...state.user,
            user_id: userId,
            user_name: userName,
            user_role: userRole,
            updated_at: new Date().toISOString(),
          }
        : {
            user_id: userId,
            pet_id: '',
            user_name: userName,
            user_role: userRole,
            password: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
    })),
  setUserId: userId =>
    set(state => ({
      user: state.user
        ? {
            ...state.user,
            user_id: userId,
            updated_at: new Date().toISOString(),
          }
        : {
            user_id: userId,
            pet_id: '',
            user_name: '',
            user_role: 'general' as UserRole,
            password: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
    })),
  setUserName: userName =>
    set(state => ({
      user: state.user
        ? {
            ...state.user,
            user_name: userName,
            updated_at: new Date().toISOString(),
          }
        : {
            user_id: '',
            pet_id: '',
            user_name: userName,
            user_role: 'general' as UserRole,
            password: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
    })),
  setUserRole: userRole =>
    set(state => ({
      user: state.user
        ? {
            ...state.user,
            user_role: userRole,
            updated_at: new Date().toISOString(),
          }
        : {
            user_id: '',
            pet_id: '',
            user_name: '',
            user_role: userRole,
            password: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
    })),
  setPassword: password =>
    set(state => ({
      user: state.user
        ? {
            ...state.user,
            password,
            updated_at: new Date().toISOString(),
          }
        : {
            user_id: '',
            pet_id: '',
            user_name: '',
            user_role: 'general' as UserRole,
            password,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
    })),
  setPetId: petId =>
    set(state => ({
      user: state.user
        ? {
            ...state.user,
            pet_id: petId,
            updated_at: new Date().toISOString(),
          }
        : {
            user_id: '',
            pet_id: petId,
            user_name: '',
            user_role: 'general' as UserRole,
            password: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
    })),

  // サインアップ関連
  setSignupData: data =>
    set(state => ({
      signupData: state.signupData
        ? {
            ...state.signupData,
            ...data,
          }
        : {
            user_name: '',
            password: '',
            pet_id: '',
            ...data,
          },
    })),
  setPet: pet =>
    set(state => ({
      signupData: state.signupData
        ? {
            ...state.signupData,
            pet,
          }
        : {
            user_name: '',
            password: '',
            pet_id: '',
            pet,
          },
    })),
  setPetCategory: category =>
    set(state => ({
      signupData: state.signupData
        ? {
            ...state.signupData,
            pet: state.signupData.pet
              ? {
                  ...state.signupData.pet,
                  category,
                  updated_at: new Date().toISOString(),
                }
              : {
                  pet_id: '',
                  name: '',
                  category,
                  birth_date: '',
                  gender: 'none',
                  pet_info: [],
                  image_name: '',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
          }
        : {
            user_name: '',
            password: '',
            pet_id: '',
            pet: {
              pet_id: '',
              name: '',
              category,
              birth_date: '',
              gender: 'none',
              pet_info: [],
              image_name: '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
    })),
  setPetImageName: imageName =>
    set(state => ({
      signupData: state.signupData
        ? {
            ...state.signupData,
            pet: state.signupData.pet
              ? {
                  ...state.signupData.pet,
                  image_name: imageName,
                  updated_at: new Date().toISOString(),
                }
              : {
                  pet_id: '',
                  name: '',
                  category: '',
                  birth_date: '',
                  gender: 'none',
                  pet_info: [],
                  image_name: imageName,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
          }
        : {
            user_name: '',
            password: '',
            pet_id: '',
            pet: {
              pet_id: '',
              name: '',
              category: '',
              birth_date: '',
              gender: 'none',
              pet_info: [],
              image_name: imageName,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
    })),
  clearSignupData: () => set({ signupData: null }),

  // API操作
  createUser: async (userId, data) => {
    set({ loading: true, error: null });
    try {
      const user = await userApi.createUser(userId, data);
      set({ user });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message });
      } else {
        set({ error: '予期しないエラーが発生しました' });
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async userId => {
    set({ loading: true, error: null });
    try {
      const user = await userApi.fetchUser(userId);
      set({ user });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message });
      } else {
        set({ error: '予期しないエラーが発生しました' });
      }
    } finally {
      set({ loading: false });
    }
  },

  updateUserName: async (userId, data) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await userApi.updateUserName(userId, data);
      set({ user: updatedUser });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message });
      } else {
        set({ error: '予期しないエラーが発生しました' });
      }
    } finally {
      set({ loading: false });
    }
  },

  updateUserPassword: async (userId, data) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await userApi.updateUserPassword(userId, data);
      set({ user: updatedUser });
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message });
      } else {
        set({ error: '予期しないエラーが発生しました' });
      }
    } finally {
      set({ loading: false });
    }
  },

  clearUser: () => set({ user: null }),
}));
