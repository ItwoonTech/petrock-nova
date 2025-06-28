import type { Pet } from './pet';
export interface ChatMessage {
  pet_id: string;
  sender: 'user' | 'ai';
  content: string;
  created_at: string; // ISO 8601 format
}

// POST /{pet_id}/chats 用
export type CreateChat = Pick<ChatMessage, 'content'> & {
  category: Pet['category'];
  birth_date: Pet['birth_date'];
  gender: Pet['gender'];
};

// PUTは今回なし
