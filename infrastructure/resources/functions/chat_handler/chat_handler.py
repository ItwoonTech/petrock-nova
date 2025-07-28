import json
import os
from datetime import UTC, datetime
from http import HTTPStatus

import boto3
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.validation import SchemaValidationError, validate
from schema import POST_INPUT_SCHEMA

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL")
PET_TABLE_NAME = os.getenv("PET_TABLE_NAME")

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=DYNAMODB_ENDPOINT_URL,
    region_name="ap-northeast-1",
)
pet_table = dynamodb.Table(PET_TABLE_NAME)


def update_chat(event: dict, context: LambdaContext) -> dict:
    try:
        path_parameters = event["pathParameters"]
        pet_id = path_parameters["pet_id"]

        if pet_id is None:
            return {
                "statusCode": HTTPStatus.BAD_REQUEST,
                "body": json.dumps(
                    {"message": "ペットIDが必要です"}, ensure_ascii=False
                ),
            }

        request_body = json.loads(event["body"])

        try:
            validate(request_body, schema=POST_INPUT_SCHEMA)
        except SchemaValidationError as e:
            return {
                "statusCode": HTTPStatus.BAD_REQUEST,
                "body": json.dumps(
                    {"message": e.validation_message}, ensure_ascii=False
                ),
            }

        chat_message = {
            "sender": "user",
            "content": request_body["content"],
            "created_at": datetime.now(UTC).isoformat(),
        }

        response = pet_table.get_item(Key={"pet_id": pet_id})

        if response is None:
            return {
                "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR,
                "body": json.dumps(
                    {"message": "DynamoDBからデータを取得できませんでした"},
                    ensure_ascii=False,
                ),
            }

        if "Item" not in response:  # まだペットの情報が登録されていない(あり得ない)
            current_chat_history = [chat_message]

            new_item = {
                "pet_id": pet_id,
                "chat_history": current_chat_history,
            }
            pet_table.put_item(Item=new_item)
        else:  # すでにペットの情報が登録されている
            item = response.get("Item")

            current_chat_history = item.get("chat_history", [])
            current_chat_history.append(chat_message)

            pet_table.update_item(
                Key={"pet_id": pet_id},
                UpdateExpression="SET chat_history = :chat_history",
                ExpressionAttributeValues={":chat_history": current_chat_history},
            )

        return {
            "statusCode": HTTPStatus.OK,
            "body": json.dumps(
                {
                    "chat_history": current_chat_history,
                },
                ensure_ascii=False,
            ),
        }

    except Exception as e:
        return {
            "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR,
            "body": json.dumps({"message": str(e)}, ensure_ascii=False),
        }


def get_chat(event: dict, context: LambdaContext) -> dict:
    path_parameters = event["pathParameters"]
    pet_id = path_parameters["pet_id"]

    if pet_id is None:
        return {
            "statusCode": HTTPStatus.BAD_REQUEST,
            "body": json.dumps({"message": "ペットIDが必要です"}, ensure_ascii=False),
        }

    try:
        response = pet_table.get_item(
            Key={"pet_id": pet_id},
            ProjectionExpression="chat_history"
        )
        item = response.get("Item")

        if not item:
            return {
                "statusCode": HTTPStatus.NOT_FOUND,
                "body": json.dumps(
                    {"message": "ペットが見つかりませんでした"},
                    ensure_ascii=False,
                ),
            }

        return {
            "statusCode": HTTPStatus.OK,
            "body": json.dumps(item, ensure_ascii=False),
        }

    except Exception as e:
        return {
            "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR,
            "body": json.dumps({"message": str(e)}, ensure_ascii=False),
        }
