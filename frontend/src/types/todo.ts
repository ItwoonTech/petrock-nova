/**
 * サブタスクのインターフェース（例：「えさやり（朝）」など）
 * @property id - サブタスクの一意な識別子
 * @property text - サブタスクのテキスト
 * @property completed - サブタスクの完了状態
 * @property repeated - サブタスクの繰り返し状態
 * @property createdAt - サブタスクの作成日時
 */
export interface SubTodo {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
}

/**
 * タスク（ToDo）のインターフェース（例：「えさやり」など）
 * @property id - タスクの一意な識別子
 * @property text - タスクのタイトルや内容
 * @property description - タスクの詳細説明（任意）
 * @property completed - タスクの完了状態
 * @property repeated - タスクの繰り返し状態
 * @property createdAt - タスクの作成日時
 * @property hasDropdown - サブタスクを持つかどうか
 * @property subTodo - サブタスクの配列（任意）
 * @property isExpanded - サブタスク表示の開閉状態（任意）
 */
export interface Todo {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  repeated: boolean;
  hasDropdown: boolean;
  subTodo?: SubTodo[];
  isExpanded?: boolean;
}
