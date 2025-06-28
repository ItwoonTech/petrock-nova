export type UserRole = 'child' | 'parent' | 'general';

export type User = {
  user_id: string;
  pet_id: string;
  user_name: string;
  user_role: UserRole;
  password: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
};

// POST /users 用（OpenAPIに準拠）
export type CreateUser = Pick<User, 'user_name' | 'user_role' | 'password'>;

// PUT /users/{user_id} 用（更新対象は user_name のみ）
export type UpdateUserName = Pick<User, 'user_name'>;

// PUT /users/{user_id}/password 用（更新対象は password のみ）
export type UpdateUserPassword = Pick<User, 'password'>;
