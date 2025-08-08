import random
import uuid
from datetime import date, datetime, timedelta

import boto3
from botocore.exceptions import ClientError
from faker import Faker

fake = Faker(["ja_JP", "en_US"])

weathers = ["晴れ", "曇り", "雨", "雪"]


def generate_sub_task() -> dict:
    return {
        "title": fake["ja_JP"].word(),
        "description": fake["ja_JP"].sentence(),
        "completed": False,
        "scheduled_time": fake.time(pattern="%H:%M"),
    }


def generate_task(total_sub_task: int = 3) -> dict:
    return {
        "title": fake["ja_JP"].word(),
        "description": fake["ja_JP"].sentence(),
        "scheduled_time": fake.time(pattern="%H:%M"),
        "completed": False,
        "repeat": fake.boolean(),
        "sub_task": [generate_sub_task() for _ in range(total_sub_task)],
    }


def generate_diary(pet_id: str, diary_date: date, total_task: int = 1) -> dict:
    now = datetime.now()
    date_of_birth = fake.date_of_birth().isoformat()

    return {
        "pet_id": pet_id,
        "date": diary_date.isoformat(),
        "picture_name": f"{pet_id}/{uuid.uuid4()}.jpg",
        "reacted": fake.boolean(),
        "advice": fake["ja_JP"].sentence(),
        "comment": fake["ja_JP"].sentence(),
        "weather": fake.random_element(weathers),
        "temperature": str(round(random.uniform(10, 30), 1)),
        "category": fake.word(),
        "birth_date": date_of_birth,
        "task": [generate_task(random.randint(0, 2)) for _ in range(total_task)],
        "created_at": now.isoformat(timespec="seconds"),
        "updated_at": now.isoformat(timespec="seconds"),
    }


def seed_diary_table(total_diaries: int = 5) -> bool:
    dynamodb = boto3.resource(
        "dynamodb",
        endpoint_url="http://localhost:4566",
        region_name="ap-northeast-1",
    )
    table = dynamodb.Table("petrock-nova-diary-table")

    try:
        table.table_status
    except ClientError as error:
        print(error)
        return False

    pet_id = fake.uuid4()

    for i in range(total_diaries):
        diary_date = date.today() + timedelta(days=i)
        diary = generate_diary(pet_id, diary_date)
        try:
            table.put_item(Item=diary)
        except ClientError as error:
            print(error)
            return False

    return True


def main():
    try:
        total_diaries = int(input("投入する日記の数を入力してください [5]: ") or "5")
    except ValueError as error:
        print(error)
        return

    success = seed_diary_table(total_diaries)

    if success:
        print(f"{total_diaries}件の日記を投入しました")
    else:
        print("日記の投入に失敗しました")


if __name__ == "__main__":
    main()