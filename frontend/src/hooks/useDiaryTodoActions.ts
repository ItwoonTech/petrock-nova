// hooks/useDiaryTodoActions.ts
import { useDiaryStore } from '@/stores/diaryStore';

// Todoの追加
export const useAddTodo = () => {
  const addTodo = useDiaryStore(state => state.addTodoToDiary);
  return async (text: string, description?: string, hasDropdown?: boolean) =>
    await addTodo(text, description, hasDropdown);
};

// Todoの完了状態の切り替え
export const useToggleTodo = () => {
  const toggleTodo = useDiaryStore(state => state.toggleTodoCompleted);
  return async (id: string) => await toggleTodo(id);
};

// Todoの削除
export const useDeleteTodo = () => {
  const deleteTodo = useDiaryStore(state => state.deleteTodoFromDiary);
  return async (id: string) => await deleteTodo(id);
};

// Todoの展開状態の切り替え
export const useToggleExpanded = () => {
  const toggle = useDiaryStore(state => state.toggleTodoExpanded);
  return (id: string) => toggle(id);
};

// Todoの繰り返し状態の切り替え
export const useToggleRepeat = () => {
  const toggle = useDiaryStore(state => state.toggleTodoRepeated);
  return async (id: string) => await toggle(id);
};

// サブタスクの追加
export const useAddSubtask = () => {
  const addSubtask = useDiaryStore(state => state.addSubtaskToTodo);
  return async (todoId: string, text: string) => await addSubtask(todoId, text);
};

// サブタスクの完了状態の切り替え
export const useToggleSubtask = () => {
  const toggle = useDiaryStore(state => state.toggleSubtaskCompleted);
  return async (todoId: string, subtaskId: string) => await toggle(todoId, subtaskId);
};

// サブタスクの削除
export const useDeleteSubtask = () => {
  const deleteSubtask = useDiaryStore(state => state.deleteSubtaskFromTodo);
  return async (todoId: string, subtaskId: string) => await deleteSubtask(todoId, subtaskId);
};
