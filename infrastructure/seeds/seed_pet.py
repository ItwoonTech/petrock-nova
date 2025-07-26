import boto3
from botocore.exceptions import ClientError
from faker import Faker

fake = Faker(["ja_JP", "en_US"])

TOTAL_PET_CARE_NOTE = 5

pet_genders = ["male", "female", "none"]

pet_care_note_icons = [
    "Dog",
    "Bone",
    "Smile",
    "Frown",
    "Utensils",
    "Cookie",
]


def generate_pets(total_pet: int = 5) -> list[dict]:
    pet_list = []

    for _ in range(total_pet):
        pet = {
            "pet_id": fake.uuid4(),
            "name": fake["ja_JP"].name(),
            "category": fake["ja_JP"].word(),
            "birth_date": fake.date_of_birth().isoformat(),
            "gender": fake.random_element(pet_genders),
            "picture_name": f"{fake['en_US'].word()}.jpg",
            "care_notes": [
                {
                    "title": fake["ja_JP"].word(),
                    "description": fake["ja_JP"].word(),
                    "icon": fake.random_element(pet_care_note_icons),
                }
                for _ in range(TOTAL_PET_CARE_NOTE)
            ],
            "image_name": f"{fake['en_US'].word()}.jpg",
            "created_at": fake.date_time().isoformat(timespec="seconds"),
            "updated_at": fake.date_time().isoformat(timespec="seconds"),
        }
        pet_list.append(pet)

    return pet_list


def seed_pet_table(total_pet: int = 5) -> bool:
    dynamodb = boto3.resource(
        "dynamodb",
        endpoint_url="http://localhost:4566",
        region_name="ap-northeast-1",
    )
    table = dynamodb.Table("petrock-nova-pet-table")

    try:
        table.table_status
    except ClientError as error:
        print(error)
        return False

    pet_list = generate_pets(total_pet)

    for pet in pet_list:
        try:
            table.put_item(Item=pet)
        except ClientError as error:
            print(error)
            return False

    return True


def main():
    try:
        total_pet = int(input("投入するペットの数を入力してください [5]: ") or "5")
    except ValueError as error:
        print(error)
        return

    success = seed_pet_table(total_pet)
    if success:
        print(f"{total_pet}件のペットを投入しました")
    else:
        print("ペットの投入に失敗しました")


if __name__ == "__main__":
    main()
