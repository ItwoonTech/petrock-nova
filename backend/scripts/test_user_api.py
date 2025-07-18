import uuid
from enum import Enum

import inquirer
import requests

API_BASE_URL = "http://localhost:3000"


class UserAPIAction(Enum):
    GET = "GET /users/{user_id}"
    POST = "POST /users/{user_id}"
    PUT = "PUT /users/{user_id}"


def get_user(user_id: str) -> None:
    print(f"Testing GET /users/{user_id}")

    url = f"{API_BASE_URL}/users/{user_id}"
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.get(url, headers=headers)
        print(f"Status: {response.status_code}")
        print(response.json())
    except requests.exceptions.RequestException as exception:
        print(exception)


def create_user(user_id: str) -> None:
    print(f"Testing POST /users/{user_id}")

    url = f"{API_BASE_URL}/users/{user_id}"
    headers = {"Content-Type": "application/json"}
    request_body = {
        "pet_id": str(uuid.uuid4()),
        "user_name": "shunsei",
        "user_role": "general",
        "password": "1234",
    }

    try:
        response = requests.post(url, headers=headers, json=request_body)
        print(f"Status: {response.status_code}")
        print(response.json())
    except requests.exceptions.RequestException as exception:
        print(exception)


def update_user(user_id: str) -> None:
    print(f"Testing PUT /users/{user_id}")

    url = f"{API_BASE_URL}/users/{user_id}"
    headers = {"Content-Type": "application/json"}
    request_body = {
        "password": "5678",
        "invalid_key": "invalid_value",
    }

    try:
        response = requests.put(url, headers=headers, json=request_body)
        print(f"Status: {response.status_code}")
        print(response.json())
    except requests.exceptions.RequestException as exception:
        print(exception)


def show_menu() -> None:
    user_id = str(uuid.uuid4())

    while True:
        questions = [
            inquirer.List(
                "action",
                message="PetRock API Test CLI",
                choices=[
                    UserAPIAction.GET.value,
                    UserAPIAction.POST.value,
                    UserAPIAction.PUT.value,
                    "Exit",
                ],
            )
        ]

        answers = inquirer.prompt(questions)
        if not answers:
            break

        action = answers["action"]
        if action == UserAPIAction.GET.value:
            get_user(user_id)
        elif action == UserAPIAction.POST.value:
            create_user(user_id)
        elif action == UserAPIAction.PUT.value:
            update_user(user_id)
        elif action == "Exit":
            break


if __name__ == "__main__":
    show_menu()
