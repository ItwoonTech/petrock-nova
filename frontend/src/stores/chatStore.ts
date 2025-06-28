import { chatApi } from '@/api/chatApi';
import type { ChatMessage } from '@/types/chat';
import type { Pet } from '@/types/pet';
import { create } from 'zustand';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentChatId: number;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  sendMessage: (content: string, pet: Pet) => Promise<void>;
  fetchChatHistory: (petId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  currentChatId: 0,

  addMessage: message =>
    set(state => ({
      messages: [...state.messages, message],
    })),

  setMessages: messages =>
    set(() => ({
      messages: [...messages], // chat_idによるソートやcurrentChatIdの管理は不要
    })),

  setLoading: isLoading => set({ isLoading }),

  setError: error => set({ error }),

  sendMessage: async (content: string, pet: Pet) => {
    try {
      // 空文字チェックとpetオブジェクトの存在チェック
      if (!content.trim() || !pet) {
        return;
      }

      set({ isLoading: true, error: null });

      const timestamp = new Date().toISOString();

      const userMessage: ChatMessage = {
        pet_id: pet.pet_id,
        sender: 'user',
        content,
        created_at: timestamp,
      };
      get().addMessage(userMessage);

      // 引数で渡されたpetオブジェクトからデータを取得
      const createChatData = {
        content,
        category: pet.category ?? '',
        birth_date: pet.birth_date ?? '',
        gender: pet.gender ?? 'none',
      };

      const aiMessage = await chatApi.sendMessage(pet.pet_id, createChatData);

      // AIからのメッセージが空でなければ追加
      if (typeof aiMessage.content === 'string' && aiMessage.content.trim()) {
        get().addMessage(aiMessage);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '不明なエラーが発生しました' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchChatHistory: async (petId: string) => {
    try {
      set({ isLoading: true, error: null });
      const messages = await chatApi.fetchChatHistory(petId);
      get().setMessages(messages);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '不明なエラーが発生しました' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
