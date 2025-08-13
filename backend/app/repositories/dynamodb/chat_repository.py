import boto3

from app.exceptions.pet_not_found_exception import PetNotFoundException
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
        """
        ペットidに基づいてチャット履歴を取得する

        Args:
            pet_id (str): ペットid

        Returns:
            list[ChatMessage] | None: チャット履歴（存在しない場合はNone）

        Raises:
            PetNotFoundException: ペットが存在しない場合
        """
        response = self.table.get_item(Key={"pet_id": pet_id}, ProjectionExpression="chat_history")

        if "Item" not in response:
            raise PetNotFoundException(f"ペットが見つかりませんでした: {pet_id}")

        item = response["Item"]

        if "chat_history" not in item:
            return None

        chat_history = item["chat_history"]
        return [ChatMessage.from_dict(message) for message in chat_history]

    def append_message(self, pet_id: str, message: ChatMessage) -> None:
        """
        チャット履歴にメッセージを追加する

        Args:
            pet_id (str): ペットid
            message (ChatMessage): 追加するメッセージ
        """
        self.table.update_item(
            Key={"pet_id": pet_id},
            UpdateExpression="""
                SET chat_history = list_append(
                    if_not_exists(
                        chat_history,
                        :empty_list
                    ),
                    :chat_message
                )
            """,
            ExpressionAttributeValues={
                ":empty_list": [],
                ":chat_message": [message.model_dump()],
            },
        )
