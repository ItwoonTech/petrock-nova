import json

import boto3

from app.ai.interface.pet_chat_assisstant import PetChatAssistant
from app.models.chat import ChatMessage
from app.repositories.interface.chat_repository import ChatRepository


class BedrockPetChatAssisstant(PetChatAssistant):
    def __init__(
        self,
        secret_name: str,
        chat_repository: ChatRepository,
        region_name: str = "ap-northeast-1",
    ):
        self.bedrock_agent_runtime_client = boto3.client(
            "bedrock-agent-runtime",
            region_name=region_name,
        )
        self.secret_manager_client = boto3.client(
            "secretsmanager",
            region_name=region_name,
        )

        self.secret_name = secret_name
        self.chat_repository = chat_repository

    def chat(self, pet_id: str, user_message: ChatMessage) -> ChatMessage:
        """
        AIアシスタントと会話する

        Args:
            pet_id: ペットID
            user_message: ユーザーからのメッセージ

        Returns:
            ChatMessage: AIアシスタントからの応答
        """
        agent_id, agent_alias_id = self.get_agent_id()

        response = self.bedrock_agent_runtime_client.invoke_agent(
            agentId=agent_id,
            agentAliasId=agent_alias_id,
            sessionId=pet_id,
            inputText=user_message.content,
            sessionState={
                "sessionAttributes": {
                    "petId": pet_id,
                }
            },
        )

        agent_response = ""
        for event in response.get("completion", []):
            chunk = event["chunk"]
            agent_response += chunk["bytes"].decode()

        return ChatMessage(content=agent_response)

    def get_agent_id(self) -> tuple[str, str]:
        """
        シークレットからエージェントIDとエイリアスIDを取得する

        Raises:
            ValueError: エージェントIDがシークレットに存在しない場合
            ValueError: エイリアスIDがシークレットに存在しない場合

        Returns:
            tuple[str, str]: エージェントIDとエイリアスID
        """
        secret_response = self.secret_manager_client.get_secret_value(SecretId=self.secret_name)
        secrets = json.loads(secret_response["SecretString"])

        agent_id = secrets["chatAssisstantAgentId"]
        agent_alias_id = secrets["chatAssisstantAgentAliasId"]

        if agent_id is None:
            raise ValueError("agent_id がシークレットに存在しません")

        if agent_alias_id is None:
            raise ValueError("agent_alias_id がシークレットに存在しません")

        return agent_id, agent_alias_id
