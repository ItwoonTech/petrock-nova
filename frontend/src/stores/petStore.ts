import { petApi } from '@/api/petApi';
import { s3Api } from '@/api/s3Api';
import type { CreatePet, Pet, UpdatePetInfo } from '@/types/pet';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// インターフェース定義
// ============================================================================

/**
 * ペット基本情報操作に関するインターフェース
 */
interface PetBasicOperations {
  pet: Pet | null;
  pet_id: string | null;
  petImageUrl: string | null;
  fetchPet: (pet_id: string) => Promise<void>;
  createPet: (pet_id: string, petData: CreatePet) => Promise<Pet>;
  setPetId: (pet_id: string) => void;
  setPetBasicInfo: (basicInfo: CreatePet) => void;
  updatePetImageName: (image_name: string) => void;
  getPetImageUrl: () => Promise<string | null>;
  clearPet: () => void;
}

/**
 * ペット情報（pet_info）操作に関するインターフェース
 */
interface PetInfoOperations {
  // pet_infoの基本操作
  addPetInfo: (title: string, description: string, icon: string) => Promise<void>;
  updatePetInfo: (index: number, title: string, description: string, icon: string) => Promise<void>;
  deletePetInfo: (index: number) => Promise<void>;
  deleteMultiplePetInfo: (indices: number[]) => Promise<void>;
  updatePetInfoIcon: (index: number, icon: string) => Promise<void>;
}

/**
 * PetStoreの統合インターフェース
 */
export interface PetStore extends PetBasicOperations, PetInfoOperations {}

// ============================================================================
// ヘルパー関数
// ============================================================================

/**
 * ローカル状態とDBの両方を更新する共通処理
 */
const updatePetStateAndDB = async (
  pet: Pet,
  updatedPetInfo: Pet['pet_info'],
  set: any,
  errorMessage: string
) => {
  const updatedPet = { ...pet, pet_info: updatedPetInfo };

  // ローカル状態を更新
  set({ pet: updatedPet });

  // DBにも保存
  try {
    const updateData: UpdatePetInfo = {
      pet_info: updatedPetInfo.map(info => ({
        pet_info_title: info.pet_info_title,
        pet_info_description: info.pet_info_description,
        pet_info_icon: info.pet_info_icon,
      })),
    };
    await petApi.updatePetInfo(pet.pet_id, updateData);
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

// ============================================================================
// Zustand Store 実装
// ============================================================================

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      // ========================================================================
      // 基本データ
      // ========================================================================

      pet: null,
      pet_id: null,
      petImageUrl: null,

      // ========================================================================
      // ペット基本情報操作
      // ========================================================================

      fetchPet: async (pet_id: string) => {
        try {
          const data = await petApi.fetchPet(pet_id);
          set({ pet: data, pet_id });
        } catch (error) {
          console.error('Failed to fetch pet:', error);
          set({ pet: null, pet_id: null });
        }
      },

      createPet: async (pet_id: string, petData: CreatePet) => {
        try {
          const data = await petApi.createPet(pet_id, petData);
          set({ pet: data, pet_id: data.pet_id });
          return data;
        } catch (error) {
          console.error('Failed to create pet:', error);
          throw error;
        }
      },

      setPetId: (pet_id: string) => set({ pet_id }),

      setPetBasicInfo: basicInfo =>
        set(state => ({
          pet: state.pet
            ? {
                ...state.pet,
                ...basicInfo,
                updated_at: new Date().toISOString(),
              }
            : {
                pet_id: '',
                ...basicInfo,
                pet_info: [],
                image_name: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
        })),

      updatePetImageName: async (image_name: string) => {
        try {
          const currentState = get();
          if (!currentState.pet_id) {
            throw new Error('pet_idが設定されていません');
          }

          const updatedPet = await petApi.updatePetImageName(currentState.pet_id, { image_name });
          set({ pet: updatedPet });
        } catch (error) {
          console.error('ペット画像名の更新に失敗しました:', error);
          throw error;
        }
      },
      clearPet: () => set({ pet: null, pet_id: null }),

      // ========================================================================
      // ペット情報（pet_info）操作
      // ========================================================================

      addPetInfo: async (title: string, description: string, icon: string) => {
        const pet = get().pet;
        if (!pet) return;

        const newPetInfo = {
          pet_info_title: title,
          pet_info_description: description,
          pet_info_icon: icon,
        };

        const updatedPetInfo = [...pet.pet_info, newPetInfo];
        await updatePetStateAndDB(
          pet,
          updatedPetInfo,
          set,
          'Failed to save pet info addition to database:'
        );
      },

      updatePetInfo: async (index: number, title: string, description: string, icon: string) => {
        const pet = get().pet;
        if (!pet) return;

        const updatedPetInfo = [...pet.pet_info];
        updatedPetInfo[index] = {
          pet_info_title: title,
          pet_info_description: description,
          pet_info_icon: icon,
        };

        await updatePetStateAndDB(
          pet,
          updatedPetInfo,
          set,
          'Failed to save pet info update to database:'
        );
      },

      deletePetInfo: async (index: number) => {
        const pet = get().pet;
        if (!pet) return;

        const updatedPetInfo = pet.pet_info.filter((_, i) => i !== index);
        await updatePetStateAndDB(
          pet,
          updatedPetInfo,
          set,
          'Failed to save pet info deletion to database:'
        );
      },

      deleteMultiplePetInfo: async (indices: number[]) => {
        const pet = get().pet;
        if (!pet) return;

        const updatedPetInfo = pet.pet_info.filter((_, i) => !indices.includes(i));
        await updatePetStateAndDB(
          pet,
          updatedPetInfo,
          set,
          'Failed to save multiple pet info deletion to database:'
        );
      },

      updatePetInfoIcon: async (index: number, icon: string) => {
        const pet = get().pet;
        if (!pet) return;

        const updatedPetInfo = [...pet.pet_info];
        updatedPetInfo[index] = {
          ...updatedPetInfo[index],
          pet_info_icon: icon,
        };

        await updatePetStateAndDB(
          pet,
          updatedPetInfo,
          set,
          'Failed to save pet info icon update to database:'
        );
      },
      getPetImageUrl: async () => {
        try {
          const currentState = get();
          if (!currentState.pet_id || !currentState.pet?.image_name) {
            return null;
          }

          const presignedUrl = await s3Api.getDownloadPresignedUrl(
            currentState.pet_id,
            currentState.pet.image_name
          );
          set({ petImageUrl: presignedUrl });
          return presignedUrl;
        } catch (error) {
          console.error('ペット画像URLの取得に失敗しました:', error);
          return null;
        }
      },
    }),
    {
      name: 'pet-storage',
      partialize: state => ({ pet: state.pet, pet_id: state.pet_id }),
    }
  )
);
