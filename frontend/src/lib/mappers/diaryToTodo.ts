import type { Diary } from '@/types/diary';
import type { Todo, SubTodo } from '@/types/todo';

/**
 * DiaryEntry内の複数タスクをTodo[]に変換
 */
export const mapDiaryToTodoList = (entry: Diary): Todo[] => {
  if (!entry.task || !Array.isArray(entry.task)) return [];

  return entry.task.map((task, taskIndex) => {
    const subTodo: SubTodo[] = task.sub_task?.map((subtask, index) => ({
      id: `${entry.pet_id}-${entry.date}-${task.task_title}-subtask-${index}`,
      text: subtask.title,
      description: subtask.description,
      completed: subtask.completed,
    })) || [];

    const hasSubtasks = subTodo.length > 0;
    const taskId = `${entry.pet_id}-${entry.date}-${task.task_title}-${taskIndex}`;

    return {
      id: taskId,
      text: task.task_title,
      description: task.task_description,
      completed: task.completed,
      repeated: task.repeat,
      hasDropdown: hasSubtasks,
      isExpanded: false,
      subTodo,
    };
  });
};
