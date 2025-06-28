import {
  API_BASE_URL,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  HTTP_HEADERS,
  HTTP_METHOD,
} from '@/config/api';
import type { CreateDiary, Diary, UpdateDiary } from '@/types/diary';

/**
 * @module diaryApi
 * @description このモジュールは、日記データとAPIとの通信を管理します。
 * 各メソッドは、日記エントリの取得・加工などを担当します。
 */
export const diaryApi = {
  /**
   * @function fetchDailyRecord
   * @description 指定された日付の日記を取得します。GETリクエストを使用します。
   * @param {string} petId - ペットID
   * @param {string} date - 日付（YYYY-MM-DD形式）
   * @returns {Promise<Diary | null>} 日記データ
   * @throws {Error} データ取得に失敗した場合のエラー
   */
  async fetchDailyRecord(petId: string, date: string): Promise<Diary | null> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DAILY_RECORD(petId, date)}`, {
        method: HTTP_METHOD.GET,
        headers: {
          [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
        },
      });

      if (response.status === 404) {
        // データがない場合はnullを返す
        return null;
      }

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.DAILY_RECORD.FETCH);
      }

      const data = await response.json();
      return {
        ...data,
      };
    } catch (error) {
      console.error('日記データの取得に失敗しました:', error);
      throw error;
    }
  },

  /**
   * @function createDailyRecord
   * @description 新しい日記を作成します。POSTリクエストを使用します。
   * @param {string} petId - ペットID
   * @param {string} date - 日付（YYYY-MM-DD形式）
   * @param {CreateDiary} data - 作成する日記データ
   * @returns {Promise<Diary>} 作成された日記データ
   * @throws {Error} データ作成に失敗した場合のエラー
   */
  async createDailyRecord(petId: string, date: string, data: CreateDiary): Promise<Diary> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DAILY_RECORD(petId, date)}`, {
        method: HTTP_METHOD.POST,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON,
          [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.DAILY_RECORD.CREATE);
      }

      const createdData = await response.json();
      return {
        ...createdData,
      };
    } catch (error) {
      console.error('日記データの作成に失敗しました:', error);
      throw error;
    }
  },

  /**
   * @function updateDailyRecord
   * @description 既存の日記を更新します。PUTリクエストを使用します。
   * @param {string} petId - ペットID
   * @param {string} date - 日付（YYYY-MM-DD形式）
   * @param {UpdateDiary} data - 更新する日記データ
   * @returns {Promise<Diary>} 更新された日記データ
   * @throws {Error} データ更新に失敗した場合のエラー
   */
  async updateDailyRecord(petId: string, date: string, data: UpdateDiary): Promise<Diary> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DAILY_RECORD(petId, date)}`, {
        method: HTTP_METHOD.PUT,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON,
          [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.DAILY_RECORD.UPDATE);
      }

      const updatedData = await response.json();
      return {
        ...updatedData,
      };
    } catch (error) {
      console.error('日記データの更新に失敗しました:', error);
      throw error;
    }
  },
};
