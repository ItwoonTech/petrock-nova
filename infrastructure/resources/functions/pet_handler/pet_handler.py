import json
import os

import boto3
from aws_lambda_powertools.utilities.typing import LambdaContext

DYNAMODB_ENDPOINT_URL = os.environ.get("DYNAMODB_ENDPOINT_URL")
PET_TABLE_NAME = os.environ.get("PET_TABLE_NAME")

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=DYNAMODB_ENDPOINT_URL,
    region_name="ap-northeast-1",
)
pet_table = dynamodb.Table(PET_TABLE_NAME)


def get_pet(event: dict, context: LambdaContext):
    path_parameters = event.get("pathParameters", {})
    pet_id = path_parameters.get("pet_id")

    if pet_id is None:
        return {
            "statusCode": 400,
            # 日本語のメッセージをそのまま返すためにUnicodeエスケープを無効化
            "body": json.dumps({"message": "ペットIDが必要です"}, ensure_ascii=False),
        }

    try:
        response = pet_table.get_item(Key={"pet_id": pet_id})
        item = response.get("Item")

        if not item:
            return {
                "statusCode": 404,
                "body": json.dumps(
                    {"message": "ペットが見つかりませんでした"},
                    ensure_ascii=False,
                ),
            }

        return {"statusCode": 200, "body": json.dumps(item, ensure_ascii=False)}

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}, ensure_ascii=False),
        }
