import { useToggleTodo } from '@/hooks/useDiaryTodoActions';
import { type Todo } from '@/types/todo.ts';
import DetailModal from './DetailModal';

interface TodoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
}

/**
 * タスクの詳細を表示するモーダルコンポーネント
 * タスクの内容、説明、完了状態の切り替え機能を提供
 * @param isOpen - モーダルの表示状態
 * @param onClose - モーダルを閉じる関数
 * @param todo - 表示するタスク
 */
export const TodoDetailModal = ({ isOpen, onClose, todo }: TodoDetailModalProps) => {
  const toggleTodo = useToggleTodo();

  if (!todo) return null;

  /**
   * タスクを完了状態に切り替える処理
   * 完了状態を切り替えた後、モーダルを閉じる
   */
  const handleComplete = () => {
    if (todo) {
      toggleTodo(todo.id);
      onClose();
    }
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={todo.text}
      description={todo.description}
      completed={todo.completed}
      onComplete={handleComplete}
      showAddSubtaskButton={true}
      addSubtaskModalProps={{
        todo,
        onSuccess: () => {
          onClose();
        },
      }}
    />
  );
};
