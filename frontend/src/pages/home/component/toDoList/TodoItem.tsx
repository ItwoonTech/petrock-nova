'use client';

import {
  useDeleteSubtask,
  useDeleteTodo,
  useToggleExpanded,
  useToggleRepeat,
  useToggleSubtask,
  useToggleTodo,
} from '@/hooks/useDiaryTodoActions';
import { type SubTodo, type Todo } from '@/types/todo.ts';
import { Collapsible, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import SubtaskDetailModal from './SubtaskDetailModal';
import TaskItem from './TaskItem';

interface TodoItemProps {
  todo: Todo;
  onItemClick: (todo: Todo) => void;
  readOnly?: boolean;
}

/**
 * 個々のTodoアイテムを表示するコンポーネント
 * タスクの表示、完了状態の切り替え、削除、サブタスクの表示機能を提供
 * @param todo - 表示するタスク
 * @param onItemClick - タスクがクリックされた時のコールバック関数
 */
const TodoItem = ({ todo, onItemClick, readOnly }: TodoItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState<SubTodo | null>(null);
  const [isSubtaskDetailOpen, setIsSubtaskDetailOpen] = useState(false);

  const deleteTodo = useDeleteTodo();
  const deleteSubtask = useDeleteSubtask();
  const toggleExpanded = useToggleExpanded();
  const toggleSubtask = useToggleSubtask();
  const toggleStar = useToggleRepeat();
  const toggleTodo = useToggleTodo();

  const handleMainClick = () => {
    // subtaskを持つtaskでもクリック時にTodoDetailModalを表示
    onItemClick(todo);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    toggleExpanded(todo.id);
  };

  const handleSubtaskClick = (subtask: SubTodo) => {
    if (readOnly) return;
    setSelectedSubtask(subtask);
    setIsSubtaskDetailOpen(true);
  };

  const handleSubtaskCheckboxClick = (subtask: SubTodo) => {
    if (readOnly) return;
    toggleSubtask(todo.id, subtask.id);
  };

  const handleSubtaskDetailClose = () => {
    setIsSubtaskDetailOpen(false);
    setSelectedSubtask(null);
  };

  const handleTodoCheckboxClick = () => {
    toggleTodo(todo.id);
  };

  return (
    <VStack gap={0} w="full">
      <TaskItem
        id={todo.id}
        text={todo.text}
        completed={todo.completed}
        starred={todo.repeated}
        hasDropdown={todo.hasDropdown}
        isExpanded={isExpanded}
        onClick={handleMainClick}
        onToggleExpand={handleToggleExpand}
        onCheckboxClick={handleTodoCheckboxClick}
        onStar={() => toggleStar(todo.id)}
        onDelete={() => deleteTodo(todo.id)}
        disabled={readOnly}
      />

      {/* サブタスク */}
      {todo.hasDropdown && (
        <Collapsible.Root open={isExpanded} onOpenChange={handleToggleExpand}>
          <Collapsible.Content>
            <VStack gap={2} pl={4} mt={2} w="full">
              {todo.subTodo?.map(subtask => (
                <TaskItem
                  key={subtask.id}
                  id={subtask.id}
                  text={subtask.text}
                  completed={subtask.completed}
                  onClick={() => handleSubtaskClick(subtask)}
                  onCheckboxClick={() => handleSubtaskCheckboxClick(subtask)}
                  onStar={() => toggleStar(todo.id)}
                  onDelete={() => {
                    deleteSubtask(todo.id, subtask.id);
                  }}
                  disabled={readOnly}
                />
              ))}
            </VStack>
          </Collapsible.Content>
        </Collapsible.Root>
      )}

      {/* サブタスク詳細モーダル */}
      <SubtaskDetailModal
        isOpen={isSubtaskDetailOpen}
        onClose={handleSubtaskDetailClose}
        subtask={selectedSubtask}
        todoId={todo.id}
      />
    </VStack>
  );
};

export default TodoItem;
