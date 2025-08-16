import os

import boto3
from aws_lambda_powertools.event_handler import BedrockAgentFunctionResolver
from aws_lambda_powertools.event_handler.exceptions import (
    BadRequestError,
    InternalServerError,
    NotFoundError,
)
from aws_lambda_powertools.utilities.typing import LambdaContext

DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL")
PET_TABLE_NAME = os.getenv("PET_TABLE_NAME")

dynamodb = boto3.resource(
    "dynamodb",
    endpoint_url=DYNAMODB_ENDPOINT_URL,
    region_name="ap-northeast-1",
)
pet_table = dynamodb.Table(PET_TABLE_NAME)

app = BedrockAgentFunctionResolver()


@app.tool(name="getChat", description="特定のペットの飼い主とのチャット履歴を取得する")
def get_chat() -> dict:
    session_attributes = app.current_event.session_attributes
    pet_id = session_attributes.get("petId")

    if pet_id is None:
        raise BadRequestError("ペットIDが必要です")

    try:
        response = pet_table.get_item(
            Key={"pet_id": pet_id},
            ProjectionExpression="chat_history",
        )
        item = response.get("Item")

        if not item:
            raise NotFoundError("チャット履歴が見つかりませんでした")

        return item
    except Exception as e:
        raise InternalServerError(str(e))


def lambda_handler(event: dict, context: LambdaContext) -> dict:
    return app.resolve(event, context)
