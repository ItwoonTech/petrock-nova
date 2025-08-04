from datetime import datetime, timedelta
from enum import Enum

import inquirer
import requests

API_BASE_URL = "http://localhost:3000"


class PetAPIAction(Enum):
    GET = "GET /pets/{pet_id}"
    POST = "POST /pets/{pet_id}"


def get_pet(pet_id: str) -> None:
    print(f"Testing GET /pets/{pet_id}")

    url = f"{API_BASE_URL}/pets/{pet_id}"
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        print(response.json())
    except requests.exceptions.RequestException as exception:
        print(exception)


def create_pet(pet_id: str) -> None:
    print(f"Testing POST /pets/{pet_id}")

    url = f"{API_BASE_URL}/pets/{pet_id}"
    headers = {"Content-Type": "application/json"}

    # 1年前の誕生日を設定
    birth_date = datetime.now() - timedelta(days=365)

    request_body = {
        "name": "名前",
        "category": "マルチーズ",
        "birth_date": birth_date.isoformat(),
        "gender": "female",
        "picture_name": "maltese.png",
    }

    try:
        response = requests.post(url, headers=headers, json=request_body)
        print(f"Status: {response.status_code}")
        print(response.json())
    except requests.exceptions.RequestException as exception:
        print(exception)


def show_menu() -> None:
    pet_id = "460b1c2d-5d81-4ca7-8bd7-ab3a50809c08"

    while True:
        questions = [
            inquirer.List(
                "action",
                message="PetRock Pet API Test CLI",
                choices=[
                    PetAPIAction.GET.value,
                    PetAPIAction.POST.value,
                    "Exit",
                ],
            )
        ]

        answers = inquirer.prompt(questions)
        if not answers:
            break

        action = answers["action"]
        if action == PetAPIAction.GET.value:
            get_pet(pet_id)
        elif action == PetAPIAction.POST.value:
            create_pet(pet_id)
        elif action == "Exit":
            break


if __name__ == "__main__":
    show_menu()
