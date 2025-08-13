from datetime import datetime, timedelta
from enum import Enum

import inquirer
import requests

API_BASE_URL = "http://localhost:3000"


class DiaryAPIAction(Enum):
    POST = "POST /pets/{pet_id}/diaries/{date}"
    GET = "GET /pets/{pet_id}/diaries/{date}"
    PUT = "PUT /pets/{pet_id}/diaries/{date}"


def create_diary(pet_id: str, date: str) -> None:
    print(f"Testing POST /pets/{pet_id}/diaries/{date}")

    url = f"{API_BASE_URL}/pets/{pet_id}/diaries/{date}"
    headers = {"Content-Type": "application/json"}

    # 1年前の誕生日を設定
    birth_date = datetime.now() - timedelta(days=365)

    request_body = {
        "category": "マルチーズ",
        "birth_date": birth_date.isoformat()[:10],
        "picture_name": "maltese.png",
        "weather": "晴れ",
        "temperature": "20.5",
    }

    try:
        response = requests.post(url, headers=headers, json=request_body)
        print(f"Status: {response.status_code}")
        print(response.json())
    except requests.exceptions.RequestException as exception:
        print(exception)


def get_diary(pet_id: str, date: str) -> None:
    print(f"Testing GET /pets/{pet_id}/diaries/{date}")

    url = f"{API_BASE_URL}/pets/{pet_id}/diaries/{date}"
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        print(response.json())
    except requests.exceptions.RequestException as exception:
        print(exception)


def update_diary(pet_id: str, date: str) -> None:
    print(f"Testing PUT /pets/{pet_id}/diaries/{date}")

    url = f"{API_BASE_URL}/pets/{pet_id}/diaries/{date}"
    headers = {"Content-Type": "application/json"}

    request_body = {
        "reacted": True,
        "comment": "今日も元気だったね！",
        "tasks": [
            {
                "title": "朝の散歩",
                "description": "2km歩く",
                "scheduled_time": None,
                "completed": True,
                "repeat": True,
                "sub_tasks": [
                    {
                        "title": "リードの装着",
                        "description": "首輪とリードを付ける",
                        "completed": True,
                        "scheduled_time": "07:55",
                    },
                    {
                        "title": "公園まで散歩",
                        "description": "近所の公園まで散歩",
                        "completed": False,
                        "scheduled_time": "08:00",
                    },
                ],
            },
            {
                "title": "おやつ",
                "description": "お気に入りのおやつをあげる",
                "scheduled_time": "10:00",
                "completed": False,
                "repeat": False,
                "sub_tasks": [],
            },
        ],
    }

    try:
        response = requests.put(url, headers=headers, json=request_body)
        print(f"Status: {response.status_code}")
        print(response.json())
    except requests.exceptions.RequestException as exception:
        print(exception)


def show_menu() -> None:
    pet_id = "460b1c2d-5d81-4ca7-8bd7-ab3a50809c08"
    today = datetime.now().strftime("%Y-%m-%d")

    while True:
        questions = [
            inquirer.List(
                "action",
                message="PetRock Diary API Test CLI",
                choices=[
                    DiaryAPIAction.POST.value,
                    DiaryAPIAction.GET.value,
                    DiaryAPIAction.PUT.value,
                    "Exit",
                ],
            )
        ]

        answers = inquirer.prompt(questions)
        if not answers:
            break

        action = answers["action"]
        if action == DiaryAPIAction.POST.value:
            create_diary(pet_id, today)
        elif action == DiaryAPIAction.GET.value:
            get_diary(pet_id, today)
        elif action == DiaryAPIAction.PUT.value:
            update_diary(pet_id, today)
        elif action == "Exit":
            break


if __name__ == "__main__":
    show_menu()
