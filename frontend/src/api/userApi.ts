import { API_BASE_URL, API_ENDPOINTS, HTTP_HEADERS, HTTP_METHOD } from '@/config/api';
import type { CreateUser, UpdateUserName, UpdateUserPassword, User } from '@/types/user';

/**
 * @module userApi
 * @description このモジュールは、ユーザーデータとAPIとの通信を管理します。
 * 各メソッドは、ユーザー情報の作成・取得・更新などを担当します。
 */
export const userApi = {
  /**
   * @function createUser
   * @description 新しいユーザーを作成します。POSTリクエストを使用します。
   * @param {string} userId - ユーザーID
   * @param {CreateUser} data - 作成するユーザーデータ
   * @returns {Promise<User>} 作成されたユーザー情報
   * @throws {Error} ユーザー作成に失敗した場合のエラー
   */
  async createUser(userId: string, data: CreateUser): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER(userId)}`, {
        method: HTTP_METHOD.POST,
        headers: { [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('ユーザー登録に失敗しました');
      const userData = await response.json();
      return {
        ...userData,
      };
    } catch (error) {
      console.error('ユーザー登録に失敗しました:', error);
      throw error;
    }
  },

  /**
   * @function fetchUser
   * @description 指定されたIDのユーザー情報を取得します。GETリクエストを使用します。
   * @param {string} userId - ユーザーID
   * @returns {Promise<User>} ユーザー情報
   * @throws {Error} ユーザー情報取得に失敗した場合のエラー
   */
  async fetchUser(userId: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER(userId)}`);
      if (response.status === 404) throw new Error('ユーザーが見つかりません');
      if (!response.ok) throw new Error('ユーザー情報取得に失敗しました');
      const userData = await response.json();
      return {
        ...userData,
      };
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました:', error);
      throw error;
    }
  },

  /**
   * @function updateUserName
   * @description ユーザー名を更新します。
   * @param {string} userId - ユーザーID
   * @param {UpdateUserName} data - 更新するユーザー名データ
   * @returns {Promise<User>} 更新されたユーザー情報
   * @throws {Error} ユーザー名更新に失敗した場合のエラー
   */
  async updateUserName(userId: string, data: UpdateUserName): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER(userId)}`, {
        method: HTTP_METHOD.PUT,
        headers: { [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('ユーザー名の更新に失敗しました');
      const updatedUserData = await response.json();
      return {
        ...updatedUserData,
      };
    } catch (error) {
      console.error('ユーザー名の更新に失敗しました:', error);
      throw error;
    }
  },

  // まだ使えない
  /**
   * @function updateUserPassword
   * @description ユーザーのパスワードを更新します。
   * @param {string} userId - ユーザーID
   * @param {UpdateUserPassword} data - 更新するパスワードデータ
   * @returns {Promise<User>} 更新されたユーザー情報
   * @throws {Error} パスワード更新に失敗した場合のエラー
   */
  async updateUserPassword(userId: string, data: UpdateUserPassword): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER(userId)}/password`, {
        method: HTTP_METHOD.PUT,
        headers: { [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('パスワードの更新に失敗しました');
      const passwordUpdatedData = await response.json();
      return {
        ...passwordUpdatedData,
      };
    } catch (error) {
      console.error('パスワードの更新に失敗しました:', error);
      throw error;
    }
  },
};
