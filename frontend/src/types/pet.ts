import type { Diary } from './diary';

export type PetInfo = {
  pet_info_title: string;
  pet_info_description: string;
  pet_info_icon: string;
};

export type Pet = {
  pet_id: string;
  name: string;
  category: string; // e.g. "dog", "cat"
  birth_date: string; // ISO date string
  gender: 'male' | 'female' | 'none';
  pet_info: PetInfo[];
  image_name: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
};

// Bedrock用，Pet
export type CreatePet = Pick<Pet, 'name' | 'category' | 'birth_date' | 'gender'> & {
  picture_name?: Diary['picture_name']; // 画像名はオプション
};

// Bedrock用，Petinfo
export type UpdatePetBasicInfo = Pick<Pet, 'name' | 'category' | 'birth_date' | 'gender'>;

// PUT /pets/{pet_id} 用（更新対象は pet_info のみ）
export type UpdatePetInfo = Pick<Pet, 'pet_info'>;

// PUT /pets/{pet_id} 用（更新対象は name のみ）
export type UpdatePetName = Pick<Pet, 'name'>;

// PUT 他にあれば付け加える
// 性別・カテゴリー・生年月日・生成Avatar写真などなど;
export type UpdatePetGender = Pick<Pet, 'gender'>;
export type UpdatePetCategory = Pick<Pet, 'category'>;
export type UpdatePetBirthDate = Pick<Pet, 'birth_date'>;
export type UpdatePetImageName = Pick<Pet, 'image_name'>;
