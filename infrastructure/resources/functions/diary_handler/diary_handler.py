import json
import os
from http import HTTPStatus

import boto3
from aws_lambda_powertools.utilities.typing import LambdaContext
from boto3.dynamodb.conditions import Key

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL")
DIARY_TABLE_NAME = os.getenv("DIARY_TABLE_NAME")

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=DYNAMODB_ENDPOINT_URL,
    region_name="ap-northeast-1",
)
diary_table = dynamodb.Table(DIARY_TABLE_NAME)


def get_diary(event: dict, context: LambdaContext) -> dict:
    """
    日記を取得する

    Args:
        event (dict): イベント
        context (LambdaContext): コンテキスト

    Returns:
        dict: 日記
    """
    path_parameters = event.get("pathParameters", {})

    pet_id = path_parameters.get("pet_id")
    date = path_parameters.get("date")

    if pet_id is None:
        return {
            "statusCode": HTTPStatus.BAD_REQUEST,
            "body": json.dumps({"message": "ペットIDが必要です"}, ensure_ascii=False),
        }

    if date is None:
        return {
            "statusCode": HTTPStatus.BAD_REQUEST,
            "body": json.dumps({"message": "日付が必要です"}, ensure_ascii=False),
        }

    try:
        response = diary_table.query(
            KeyConditionExpression=Key("pet_id").eq(pet_id) & Key("date").eq(date)
        )

        items = response.get("Items", [])

        if len(items) == 0:
            return {
                "statusCode": HTTPStatus.NOT_FOUND,
                "body": json.dumps(
                    {"message": "日記が見つかりませんでした"}, ensure_ascii=False
                ),
            }

        return {
            "statusCode": HTTPStatus.OK,
            "body": json.dumps(items[0], ensure_ascii=False),
        }
    except Exception as e:
        return {
            "statusCode": HTTPStatus.INTERNAL_SERVER_ERROR,
            "body": json.dumps({"message": str(e)}, ensure_ascii=False),
        }
