import {
  API_BASE_URL,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  HTTP_HEADERS,
  HTTP_METHOD,
} from '@/config/api';
import type { CreatePet, Pet, UpdatePetInfo, UpdatePetImageName } from '@/types/pet';

/**
 * @module petApi
 * @description このモジュールは、ペットデータとAPIとの通信を管理します。
 * 各メソッドは、ペット情報の作成・取得・更新などを担当します。
 */
export const petApi = {
  /**
   * @function createPet
   * @description 新しいペット情報を登録します。POSTリクエストを使用します。
   * @param {string} petId - ペットID
   * @param {CreatePet} petData - 登録するペット情報
   * @returns {Promise<Pet>} 登録されたペット情報
   * @throws {Error} 登録に失敗した場合のエラー
   */
  async createPet(petId: string, petData: CreatePet): Promise<Pet> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PET(petId)}`, {
        method: HTTP_METHOD.POST,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON,
          [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
        },
        body: JSON.stringify(petData),
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.PET.CREATE);
      }

      const data = await response.json();
      return {
        ...data,
      };
    } catch (error) {
      console.error('ペット情報の登録に失敗しました:', error);
      throw error;
    }
  },

  /**
   * @function fetchPet
   * @description ペット情報を取得します。GETリクエストを使用します。
   * @param {string} petId - ペットID
   * @returns {Promise<Pet>} ペット情報
   * @throws {Error} データ取得に失敗した場合のエラー
   */
  async fetchPet(petId: string): Promise<Pet> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PET(petId)}`, {
        method: HTTP_METHOD.GET,
        headers: {
          [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
        },
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.PET.FETCH);
      }

      const data = await response.json();
      return {
        ...data,
      };
    } catch (error) {
      console.error('ペット情報の取得に失敗しました:', error);
      throw error;
    }
  },

  /**
   * @function updatePetInfo
   * @description ペット情報を更新します。PUTリクエストを使用します。
   * @param {string} petId - ペットID
   * @param {UpdatePetInfo} petData - 更新するペット情報
   * @returns {Promise<Pet>} 更新後のペット情報
   * @throws {Error} 更新に失敗した場合のエラー
   */
  async updatePetInfo(petId: string, petData: UpdatePetInfo): Promise<Pet> {
    try {
      const updateData: UpdatePetInfo = { pet_info: petData.pet_info };
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PET(petId)}`, {
        method: HTTP_METHOD.PUT,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON,
          [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.PET.UPDATE);
      }

      const updatedData = await response.json();
      return {
        ...updatedData,
      };
    } catch (error) {
      console.error('ペット情報の更新に失敗しました:', error);
      throw error;
    }
  },

  /**
   * @function updatePetImageName
   * @description ペットの画像名を更新します。PUTリクエストを使用します。
   * @param {string} petId - ペットID
   * @param {UpdatePetImageName} imageData - 更新する画像名
   * @returns {Promise<Pet>} 更新後のペット情報
   * @throws {Error} 更新に失敗した場合のエラー
   */
  async updatePetImageName(petId: string, imageData: UpdatePetImageName): Promise<Pet> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PET(petId)}`, {
        method: HTTP_METHOD.PUT,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON,
          [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
        },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.PET.UPDATE);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('ペット画像名の更新に失敗しました:', error);
      throw error;
    }
  },
};
