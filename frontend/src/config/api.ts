/**
 * API関連の定数を定義するモジュール
 * パス部分などを分けました
 * （6/4時点では適当に入れてます）
 */

// APIのベースURL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4010';

console.log('API_BASE_URL:', API_BASE_URL);

// APIエンドポイント
export const API_ENDPOINTS = {
  // ユーザー関連
  USER: (userId: string) => `/users/${userId}`, // get, put, post

  // ペット関連
  PET: (petId: string) => `/pets/${petId}`, // get, put, post

  // 日記（タスク）関連
  DAILY_RECORD: (petId: string, date: string) => `/pets/${petId}/daily-records/${date}`, //get, put, post

  // チャット関連
  CHATS: (petId: string) => `/pets/${petId}/chats`, // get, post

  // S3関連
  PRESIGNED_URL: '/s3/presigned-url',
} as const;

// HTTPメソッド
export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export type HTTP_METHOD = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

// HTTPヘッダー
export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  APPLICATION_JSON: 'application/json',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  CACHE_CONTROL: 'Cache-Control',
} as const;

// HTTPステータスコード
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// エラーメッセージ
export const ERROR_MESSAGES = {
  USER: {
    FETCH: 'ユーザー情報の取得に失敗しました',
    CREATE: 'ユーザーの作成に失敗しました',
    UPDATE: 'ユーザー情報の更新に失敗しました',
  },
  PET: {
    FETCH: 'ペット情報の取得に失敗しました',
    CREATE: 'ペットの作成に失敗しました',
    UPDATE: 'ペット情報の更新に失敗しました',
  },
  DAILY_RECORD: {
    FETCH: '日記の取得に失敗しました',
    CREATE: '日記の作成に失敗しました',
    UPDATE: '日記の更新に失敗しました',
  },
  CHAT: {
    FETCH: 'チャットの取得に失敗しました',
    CREATE: 'チャットの作成に失敗しました',
  },
  S3: {
    PRESIGNED_URL: '署名付きURLの取得に失敗しました',
  },
  COMMON: {
    NETWORK: 'ネットワークエラーが発生しました',
    SERVER: 'サーバーエラーが発生しました',
    UNKNOWN: '予期せぬエラーが発生しました',
  },
} as const;

// ✅ APIリクエスト設定
export type ApiConfig = {
  TIMEOUT: number;
  RETRY_COUNT: number;
  RETRY_DELAY: number;
  CACHE_DURATION: number;
};

// APIリクエストの設定
export const API_CONFIG = {
  TIMEOUT: 30000, // 30秒
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // 1秒
  CACHE_DURATION: 5 * 60 * 1000, // 5分
} as const;
