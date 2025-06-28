import {
  API_BASE_URL,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  HTTP_HEADERS,
  HTTP_METHOD,
} from '@/config/api';
import type { ChatMessage, CreateChat } from '@/types/chat';

/**
 * @module chatApi
 * @description このモジュールは、チャットデータとAPIとの通信を管理します。
 * 各メソッドは、チャットメッセージの取得・送信などを担当します。
 */
export const chatApi = {
  /**
   * @function fetchChatHistory
   * @description チャット履歴を取得します。GETリクエストを使用します。
   * @param {string} petId - ペットID
   * @returns {Promise<ChatMessage[]>} チャットメッセージの配列
   * @throws {Error} データ取得に失敗した場合のエラー
   */
  async fetchChatHistory(petId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHATS(petId)}`, {
        method: HTTP_METHOD.GET,
        headers: {
          [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
        },
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.CHAT.FETCH);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('チャット履歴の取得に失敗しました:', error);
      throw error;
    }
  },

  /**
   * @function sendMessage
   * @description 新しいメッセージを送信します。POSTリクエストを使用します。
   * @param {string} petId - ペットID
   * @param {CreateChat} message - 送信するメッセージ
   * @returns {Promise<ChatMessage>} AIからの応答メッセージ
   * @throws {Error} メッセージ送信に失敗した場合のエラー
   */
  async sendMessage(petId: string, message: CreateChat): Promise<ChatMessage> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHATS(petId)}`, {
        method: HTTP_METHOD.POST,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.APPLICATION_JSON,
          [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.CHAT.CREATE);
      }

      const data = await response.json();

      // APIレスポンスが文字列の場合は、ChatMessageオブジェクトに変換
      if (typeof data === 'string') {
        return {
          pet_id: petId,
          sender: 'ai',
          content: data,
          created_at: new Date().toISOString(),
        };
      }

      return data;
    } catch (error) {
      console.error('メッセージの送信に失敗しました:', error);
      throw error;
    }
  },
};
