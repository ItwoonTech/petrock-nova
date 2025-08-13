import os

import boto3
from aws_lambda_powertools.event_handler import BedrockAgentFunctionResolver
from aws_lambda_powertools.event_handler.exceptions import (
    BadRequestError,
    InternalServerError,
    NotFoundError,
)
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

app = BedrockAgentFunctionResolver()


@app.tool(name="getDiary", description="特定の日付の飼育の記録を取得する")
def get_diary() -> dict:
    session_attributes = app.current_event.session_attributes
    pet_id = session_attributes.get("petId")

    if pet_id is None:
        raise BadRequestError("ペットIDが必要です")

    date = None

    for parameter in app.current_event.parameters:
        if parameter.name == "date":
            date = parameter.value
            break

    if date is None:
        raise BadRequestError("日付が必要です")

    try:
        response = diary_table.query(
            KeyConditionExpression=Key("pet_id").eq(pet_id) & Key("date").eq(date)
        )

        items = response.get("Items", [])

        if len(items) == 0:
            raise NotFoundError("日記が見つかりませんでした")

        return items[0]
    except Exception as e:
        raise InternalServerError(str(e))


def lambda_handler(event: dict, context: LambdaContext) -> dict:
    return app.resolve(event, context)
