import { diaryApi } from '@/api/diaryApi';
import { formatDateToYYYYMMDD } from '@/lib/dateUtils'; // 不要になるためコメントアウトまたは削除
import { mapDiaryToTodoList } from '@/lib/mappers/diaryToTodo';
import type { CreateDiary, Diary, SubTask, Task, UpdateDiary } from '@/types/diary';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================================================
// インターフェース定義
// ============================================================================

/**
 * 日記データの基本操作に関するインターフェース
 */
interface DiaryDataOperations {
  entries: Diary[];
  diary: Diary | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // データ取得・更新
  fetchDiaryByDate: (petId: string, date: string) => Promise<Diary | null>;
  fetchDiariesByMonth: (year: number, month: number, petId: string) => Promise<void>;
  updateDailyRecord: (petId: string, date: string, data: UpdateDiary) => Promise<void>;
  createDailyRecord: (petId: string, date: string, data: CreateDiary) => Promise<void>;

  // ローカル状態管理
  setEntries: (entries: Diary[]) => void;
  getEntryByDate: (date: string) => Diary | undefined;
}

/**
 * Todo（タスク）操作に関するインターフェース
 */
interface TodoOperations {
  // Todoの基本操作
  addTodoToDiary: (text: string, description?: string, hasDropdown?: boolean) => Promise<void>;
  toggleTodoCompleted: (todoId: string) => Promise<void>;
  toggleTodoRepeated: (todoId: string) => Promise<void>;
  deleteTodoFromDiary: (todoId: string) => Promise<void>;
  toggleTodoExpanded: (todoId: string) => void;
}

/**
 * Subtask（サブタスク）操作に関するインターフェース
 */
interface SubtaskOperations {
  // Subtaskの基本操作
  addSubtaskToTodo: (todoId: string, text: string) => Promise<void>;
  toggleSubtaskCompleted: (todoId: string, subtaskId: string) => Promise<void>;
  deleteSubtaskFromTodo: (todoId: string, subtaskId: string) => Promise<void>;
}

/**
 * リアクション操作に関するインターフェース
 */
interface ReactionOperations {
  setDiaryReaction: (petId: string, date: string, reacted: boolean) => Promise<void>;
}

/**
 * DiaryStoreの統合インターフェース
 */
export interface DiaryStore
  extends DiaryDataOperations,
    TodoOperations,
    SubtaskOperations,
    ReactionOperations {}

// ============================================================================
// ヘルパー関数
// ============================================================================

/**
 * ローカル状態とDBの両方を更新する共通処理（タスク更新用）
 */
const updateTaskStateAndDB = async (
  diary: Diary,
  updatedTasks: Task[],
  set: any,
  get: any,
  errorMessage: string
) => {
  const updatedDiary = { ...diary, task: updatedTasks };

  // ローカル状態を更新
  set({
    diary: updatedDiary,
    entries: get().entries.map((e: Diary) => (e.date === diary.date ? updatedDiary : e)),
  });

  // DBにも保存
  try {
    if (diary.pet_id) {
      const updateData: UpdateDiary = {
        ...(updatedTasks.length > 0 && { task: updatedTasks }),
      };

      // デバッグ用ログ
      console.log('Sending diary update request:', {
        petId: diary.pet_id,
        date: diary.date,
        data: updateData,
      });

      await diaryApi.updateDailyRecord(diary.pet_id, diary.date, updateData);
    }
  } catch (error) {
    console.error(errorMessage, error);
  }
};

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// ============================================================================
// Zustand Store 実装
// ============================================================================

export const useDiaryStore = create<DiaryStore>()(
  persist(
    (set, get) => ({
      // ========================================================================
      // 基本データ
      // ========================================================================
      entries: [],
      diary: null,
      isLoading: false,
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),

      // ========================================================================
      // 日記データ操作
      // ========================================================================

      fetchDiaryByDate: async (petId, date) => {
        set({ isLoading: true });
        try {
          const entry = await diaryApi.fetchDailyRecord(petId, date);
          set({ diary: entry });
          return entry;
        } catch (error) {
          console.warn(`Failed to fetch diary entry for ${date}:`, error);
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      createDailyRecord: async (petId, date, data) => {
        set({ isLoading: true });
        try {
          const createdEntry = await diaryApi.createDailyRecord(petId, date, data);
          set(state => ({
            diary: state.diary?.date === date ? createdEntry : state.diary,
            entries: [...state.entries, createdEntry],
          }));
        } catch (error) {
          console.error('Failed to create diary entry:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateDailyRecord: async (petId, date, data) => {
        set({ isLoading: true });
        try {
          const updatedEntry = await diaryApi.updateDailyRecord(petId, date, data);
          set(state => ({
            diary: state.diary?.date === date ? updatedEntry : state.diary,
            entries: state.entries.map(entry => (entry.date === date ? updatedEntry : entry)),
          }));
        } catch (error) {
          console.error('Failed to update diary entry:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchDiariesByMonth: async (year, month, petId) => {
        set({ isLoading: true });
        try {
          const lastDayOfMonth = new Date(year, month + 1, 0);
          const daysInMonth = lastDayOfMonth.getDate();

          // 1日〜末日までの日付リスト
          const dateList = Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(year, month, i + 1);
            return formatDateToYYYYMMDD(date);
          });

          // 10件ずつに分割
          const chunks = chunkArray(dateList, 10);

          let allEntries: Diary[] = [];
          for (const chunk of chunks) {
            // 10件分を並列で取得
            const results = await Promise.all(
              chunk.map(date => get().fetchDiaryByDate(petId, date))
            );
            allEntries = allEntries.concat(results.filter(Boolean) as Diary[]);
            await new Promise(res => setTimeout(res, 100));
          }

          set({ entries: allEntries });
        } catch (error) {
          console.error('Failed to fetch diary entries for month:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      setEntries: entries => set({ entries }),

      getEntryByDate: date => get().entries.find(entry => entry.date === date),

      // ========================================================================
      // Todo操作
      // ========================================================================

      addTodoToDiary: async (text, description, hasDropdown = false) => {
        const diary = get().diary;
        if (!diary) return;

        const newTask: Task = {
          task_title: text,
          task_description: description,
          completed: false,
          repeat: false,
          sub_task: hasDropdown ? [] : undefined,
        };

        const updatedTasks = [...(diary.task || []), newTask];
        await updateTaskStateAndDB(
          diary,
          updatedTasks,
          set,
          get,
          'Failed to save task to database:'
        );
      },

      toggleTodoCompleted: async todoId => {
        const diary = get().diary;
        if (!diary) return;

        const todos = mapDiaryToTodoList(diary);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;

        const updatedTasks = [...(diary.task || [])];
        const task = updatedTasks[todoIndex];
        const newCompletedState = !task.completed;

        // 親タスクの完了状態を更新
        task.completed = newCompletedState;

        // subtaskがある場合、全てのsubtaskも同じ完了状態にする
        if (task.sub_task && task.sub_task.length > 0) {
          task.sub_task = task.sub_task.map(subtask => ({
            ...subtask,
            completed: newCompletedState,
          }));
        }

        await updateTaskStateAndDB(
          diary,
          updatedTasks,
          set,
          get,
          'Failed to save todo completion status to database:'
        );
      },

      toggleTodoRepeated: async todoId => {
        const diary = get().diary;
        if (!diary) return;

        const todos = mapDiaryToTodoList(diary);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;

        const updatedTasks = [...(diary.task || [])];
        updatedTasks[todoIndex] = {
          ...updatedTasks[todoIndex],
          repeat: !updatedTasks[todoIndex].repeat,
        };

        await updateTaskStateAndDB(
          diary,
          updatedTasks,
          set,
          get,
          'Failed to save todo repeat status to database:'
        );
      },

      deleteTodoFromDiary: async todoId => {
        const diary = get().diary;
        if (!diary) return;

        const todos = mapDiaryToTodoList(diary);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;

        const updatedTasks = [...(diary.task || [])];
        updatedTasks.splice(todoIndex, 1);

        await updateTaskStateAndDB(
          diary,
          updatedTasks,
          set,
          get,
          'Failed to save todo deletion to database:'
        );
      },

      toggleTodoExpanded: todoId => {
        const diary = get().diary;
        if (!diary) return;

        const todos = mapDiaryToTodoList(diary);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;

        const updatedTasks = [...(diary.task || [])];
        const task = updatedTasks[todoIndex];
        if (!task.sub_task) return;

        // isExpandedの状態を切り替える
        // （実装がなければここで状態追加が必要）
        const updatedDiary = { ...diary, task: updatedTasks };
        set({
          diary: updatedDiary,
          entries: get().entries.map(e => (e.date === diary.date ? updatedDiary : e)),
        });
      },

      // ========================================================================
      // Subtask操作
      // ========================================================================

      addSubtaskToTodo: async (todoId, text) => {
        const diary = get().diary;
        if (!diary) return;

        const todos = mapDiaryToTodoList(diary);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;

        const updatedTasks = [...(diary.task || [])];
        const task = updatedTasks[todoIndex];
        if (!task.sub_task) {
          task.sub_task = [];
        }
        const newSubtask: SubTask = {
          title: text,
          completed: false,
        };
        task.sub_task.push(newSubtask);

        await updateTaskStateAndDB(
          diary,
          updatedTasks,
          set,
          get,
          'Failed to save subtask addition to database:'
        );
      },

      toggleSubtaskCompleted: async (todoId, subtaskId) => {
        const diary = get().diary;
        if (!diary) return;

        const todos = mapDiaryToTodoList(diary);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return;

        const updatedTasks = [...(diary.task || [])];
        const task = updatedTasks[todoIndex];
        if (!task.sub_task) return;

        const subtaskIndex = task.sub_task.findIndex((_, index) => {
          const expectedSubtaskId = `${diary.pet_id}-${diary.date}-${task.task_title}-subtask-${index}`;
          return expectedSubtaskId === subtaskId;
        });
        if (subtaskIndex === -1) return;

        task.sub_task[subtaskIndex] = {
          ...task.sub_task[subtaskIndex],
          completed: !task.sub_task[subtaskIndex].completed,
        };

        // 全サブタスク完了なら親タスクも完了にする
        task.completed = task.sub_task.every(st => st.completed);

        await updateTaskStateAndDB(
          diary,
          updatedTasks,
          set,
          get,
          'Failed to save subtask completion status to database:'
        );
      },

      deleteSubtaskFromTodo: async (todoId, subtaskId) => {
        const diary = get().diary;
        if (!diary) {
          console.log('No diary found');
          return;
        }

        const todos = mapDiaryToTodoList(diary);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) {
          console.log('Todo not found:', todoId);
          return;
        }

        const updatedTasks = [...(diary.task || [])];
        const task = updatedTasks[todoIndex];
        if (!task.sub_task) {
          console.log('No subtasks found for todo:', todoId);
          return;
        }

        const subtaskIndex = task.sub_task.findIndex((_, index) => {
          const expectedSubtaskId = `${diary.pet_id}-${diary.date}-${task.task_title}-subtask-${index}`;
          return expectedSubtaskId === subtaskId;
        });
        if (subtaskIndex === -1) {
          console.log('Subtask not found:', subtaskId);
          return;
        }

        // subtaskを削除
        task.sub_task = task.sub_task.filter((_, index) => index !== subtaskIndex);

        // subtaskが一つも残っていない場合は親タスクも削除
        if (task.sub_task.length === 0) {
          updatedTasks.splice(todoIndex, 1);
        }

        await updateTaskStateAndDB(
          diary,
          updatedTasks,
          set,
          get,
          'Failed to save subtask deletion to database:'
        );
      },

      // ========================================================================
      // リアクション操作
      // ========================================================================

      setDiaryReaction: async (petId, date, reacted) => {
        if (!petId) return;
        try {
          // APIを呼び出して、reactedの状態を更新
          const updatedApiDiary = await diaryApi.updateDailyRecord(petId, date, {
            reacted,
          });

          // APIからの応答に基づいてローカルの状態を更新
          set(state => ({
            entries: state.entries.map(entry =>
              entry.date === date ? { ...entry, reacted: updatedApiDiary.reacted } : entry
            ),
            diary:
              state.diary && state.diary.date === date
                ? { ...state.diary, reacted: updatedApiDiary.reacted }
                : state.diary,
          }));
        } catch (error) {
          console.error('Failed to set diary reaction:', error);
        }
      },
    }),
    {
      name: 'diary-store',
      partialize: state => ({
        entries: state.entries,
        diary: state.diary,
      }),
    }
  )
);
