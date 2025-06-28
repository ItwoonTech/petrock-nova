import {
  API_BASE_URL,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  HTTP_HEADERS,
  HTTP_METHOD,
} from '@/config/api';

/**
 * @module s3Api
 * @description このモジュールは、S3との通信を管理します。
 * 署名付きURLの取得などの機能を提供します。
 */
export const s3Api = {
  /**
   * @function getUploadPresignedUrl
   * @description S3にペットの画像ファイルをアップロードするための署名付きURLを取得します。GETリクエストを使用します。
   * @param {string} petId - ペットID
   * @param {string} pictureName - ファイル名
   * @returns {Promise<string>} 署名付きURL
   * @throws {Error} URL取得に失敗した場合のエラー
   */
  async getUploadPresignedUrl(petId: string, pictureName: string): Promise<string> {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRESIGNED_URL}?pet_id=${petId}&picture_name=${pictureName}&operation=post`;
      console.log('署名付きURL取得開始:', { url, petId, pictureName });

      const response = await fetch(url, {
        method: HTTP_METHOD.GET,
        headers: {
          [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
        },
      });

      console.log('署名付きURL取得レスポンス:', {
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('署名付きURL取得エラー詳細:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(
          `署名付きURLの取得に失敗しました: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('署名付きURL取得成功:', { url: data.url });
      return data.url;
    } catch (error) {
      console.error('アップロード用署名付きURLの取得に失敗しました:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(
          'ネットワークエラー: APIサーバーへの接続に失敗しました。インターネット接続を確認してください。'
        );
      }
      throw error;
    }
  },

  /**
   * @function getDownloadPresignedUrl
   * @description S3からペットの画像ファイルをダウンロードするための署名付きURLを取得します。GETリクエストを使用します。
   * @param {string} petId - ペットID
   * @param {string} pictureName - ファイル名
   * @returns {Promise<string>} 署名付きURL
   * @throws {Error} URL取得に失敗した場合のエラー
   */
  async getDownloadPresignedUrl(petId: string, pictureName: string): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.PRESIGNED_URL}?pet_id=${petId}&picture_name=${pictureName}&operation=get`,
        {
          method: HTTP_METHOD.GET,
          headers: {
            [HTTP_HEADERS.ACCEPT]: HTTP_HEADERS.APPLICATION_JSON,
          },
        }
      );

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.S3.PRESIGNED_URL);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('ダウンロード用署名付きURLの取得に失敗しました:', error);
      throw error;
    }
  },

  /**
   * @function uploadFileToS3
   * @description ファイルをS3にアップロードします。
   * @param {string} presignedUrl - 署名付きURL
   * @param {Blob} blob - アップロードするファイル
   * @param {string} contentType - コンテンツタイプ
   * @returns {Promise<void>}
   * @throws {Error} アップロードに失敗した場合のエラー
   */
  async uploadFileToS3(presignedUrl: string, blob: Blob, contentType: string): Promise<void> {
    try {
      console.log('S3アップロード開始:', { presignedUrl, contentType, blobSize: blob.size });

      const response = await fetch(presignedUrl, {
        method: HTTP_METHOD.PUT,
        body: blob,
        headers: {
          [HTTP_HEADERS.CONTENT_TYPE]: contentType,
        },
      });

      console.log('S3アップロードレスポンス:', {
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('S3アップロードエラー詳細:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(
          `S3へのアップロードに失敗しました: ${response.status} ${response.statusText}`
        );
      }

      console.log('S3アップロード成功');
    } catch (error) {
      console.error('S3へのアップロードに失敗しました:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(
          'ネットワークエラー: S3への接続に失敗しました。インターネット接続を確認してください。'
        );
      }
      throw error;
    }
  },

  /**
   * @function downloadImageFromS3
   * @description S3から画像をダウンロードしてBlobとして取得します。
   * @param {string} presignedUrl - 署名付きURL
   * @returns {Promise<Blob>} ダウンロードした画像のBlob
   * @throws {Error} ダウンロードに失敗した場合のエラー
   */
  async downloadImageFromS3(presignedUrl: string): Promise<Blob> {
    try {
      // S3の署名付きURLから直接ダウンロードする際は、最小限のヘッダーのみ使用
      const response = await fetch(presignedUrl, {
        method: 'GET',
        // Content-Typeヘッダーは含めない（S3が自動的に設定する）
      });

      if (!response.ok) {
        throw new Error('S3からのダウンロードに失敗しました');
      }

      return await response.blob();
    } catch (error) {
      console.error('S3からのダウンロードに失敗しました:', error);
      throw error;
    }
  },
};
