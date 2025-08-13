import boto3

from app.models.chat import ChatMessage
from app.repositories.interface.chat_repository import ChatRepository


class DynamoDBChatRepository(ChatRepository):
    def __init__(
        self,
        table_name: str,
        dynamodb_endpoint_url: str,
        region_name: str = "ap-northeast-1",
    ):
        dynamodb = boto3.resource(
            "dynamodb",
            region_name=region_name,
            endpoint_url=dynamodb_endpoint_url,
        )
        self.table = dynamodb.Table(table_name)

    def get_by_pet_id(self, pet_id: str) -> list[ChatMessage] | None:
        """ペットIDに基づいてチャット履歴を取得する

        Args:
            pet_id (str): ペットID

        Returns:
            list[ChatMessage] | None: チャットメッセージのリスト（存在しない場合はNone）
        """
        response = self.table.get_item(Key={"pet_id": pet_id}, ProjectionExpression="chat_history")

        if "Item" not in response:
            return None

        item = response["Item"]

        if "chat_history" not in item:
            return []

        chat_history = item["chat_history"]
        return [ChatMessage.from_dict(message) for message in chat_history]

    def append_message(self, pet_id: str, message: ChatMessage) -> None:
        """チャット履歴にメッセージを追加する

        Args:
            pet_id (str): ペットID
            message (ChatMessage): 追加するメッセージ
        """
        response = self.table.get_item(Key={"pet_id": pet_id}, ProjectionExpression="chat_history")

        if "Item" not in response:
            raise Exception("ペットが作成されていません")

        item = response["Item"]

        chat_history = item.get("chat_history", [])
        chat_history.append(message.model_dump())

        self.table.update_item(
            Key={"pet_id": pet_id},
            UpdateExpression="SET chat_history = :chat_history",
            ExpressionAttributeValues={":chat_history": chat_history},
        )
