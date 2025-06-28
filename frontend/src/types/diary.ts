import type { Pet } from './pet';

export interface SubTask {
  title: string;
  description?: string;
  completed: boolean;
  sub_task_time?: string;
}
export interface Task {
  task_title: string;
  task_description?: string;
  task_time?: string;
  completed: boolean;
  repeat: boolean;
  sub_task?: SubTask[];
}

export interface Diary {
  pet_id: string;
  date: string; // format: YYYY-MM-DD
  picture_name: string; // S3の画像名
  reacted: boolean;
  advice?: string;
  comment?: string;
  weather: string;
  temperature: string; // "22.5" などの文字列形式
  task?: Task[];
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

// POST /{pet_id}/daily-records 用（OpenAPIに準拠）
export type CreateDiary = Omit<
  Diary,
  'date' | 'pet_id' | 'advice' | 'comment' | 'task' | 'created_at' | 'updated_at'
> & {
  category: Pet['category'];
  birth_date: Pet['birth_date'];
};
// PUT /{pet_id}/daily-records/{date} 用（更新対象は picture_name のみ）
export type UpdateDiaryPicture = Pick<Diary, 'picture_name'>;
// PUT /{pet_id}/daily-records/{date} 用（更新対象は reacted のみ）
export type UpdateDiaryReacted = Pick<Diary, 'reacted'>;
// PUT /{pet_id}/daily-records/{date} 用（更新対象は advice のみ）
export type UpdateDiaryAdvice = Pick<Diary, 'advice'>;
// PUT /{pet_id}/daily-records/{date} 用（更新対象は comment のみ）
export type UpdateDiaryComment = Pick<Diary, 'comment'>;
// PUT /{pet_id}/daily-records/{date} 用（更新対象は weather と temperature のみ）
export type UpdateDiaryWeather = Pick<Diary, 'weather' | 'temperature'>;
// PUT /{pet_id}/daily-records/{date} 用（更新対象は task のみ）
export type UpdateDiaryTask = Pick<Diary, 'task'>;

// PUT /{pet_id}/daily-records/{date} 用（更新対象は全て、必須ではない）
export type UpdateDiary = Partial<Omit<Diary, 'pet_id' | 'date' | 'created_at' | 'updated_at'>>;
