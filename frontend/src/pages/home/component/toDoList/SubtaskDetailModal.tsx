'use client';

import { useToggleSubtask } from '@/hooks/useDiaryTodoActions';
import { type SubTodo } from '@/types/todo.ts';
import DetailModal from './DetailModal';

interface SubtaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtask: SubTodo | null;
  todoId: string;
}

/**
 * サブタスクの詳細を表示するモーダルコンポーネント
 * サブタスクの内容、説明、完了状態の切り替え機能を提供
 * @param isOpen - モーダルの表示状態
 * @param onClose - モーダルを閉じる関数
 * @param subtask - 表示するサブタスク
 * @param todoId - 親タスクのID
 */
const SubtaskDetailModal = ({ isOpen, onClose, subtask, todoId }: SubtaskDetailModalProps) => {
  const toggleSubtask = useToggleSubtask();

  if (!subtask) return null;

  /**
   * サブタスクを完了状態に切り替える処理
   * 完了状態を切り替えた後、モーダルを閉じる
   */
  const handleComplete = () => {
    if (subtask) {
      toggleSubtask(todoId, subtask.id);
      onClose();
    }
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={subtask.text}
      description={subtask.description}
      completed={subtask.completed}
      onComplete={handleComplete}
      showAddSubtaskButton={false}
    />
  );
};

export default SubtaskDetailModal;
