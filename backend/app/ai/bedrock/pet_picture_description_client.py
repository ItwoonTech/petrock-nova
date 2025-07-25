import base64
import json
import os

import boto3

from app.ai.interface.pet_picture_description_client import PetPictureDescriptionClient
from app.repositories.interface.image_repository import ImageRepository


class BedrockPetPictureDescriptionClient(PetPictureDescriptionClient):
    MODEL_ID = "apac.anthropic.claude-3-7-sonnet-20250219-v1:0"

    def __init__(self, image_repository: ImageRepository, region_name: str = "ap-northeast-1"):
        self.bedrock_agent_client = boto3.client(
            "bedrock-agent",
            region_name=region_name,
        )
        self.bedrock_runtime_client = boto3.client(
            "bedrock-runtime",
            region_name=region_name,
        )
        self.secrets_manager_client = boto3.client(
            "secretsmanager",
            region_name=region_name,
        )

        self.image_repository = image_repository

    def describe(self, s3_image_key: str) -> str:
        """Claude 3.7 Sonnet を使用して画像の説明文を生成"""
        prompt_text = self.get_prompt()

        base64_image = self.get_base64_image(s3_image_key)

        response = self.bedrock_runtime_client.invoke_model(
            modelId=self.MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(
                {
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 1000,
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image",
                                    "source": {
                                        "type": "base64",
                                        "media_type": "image/jpeg",
                                        "data": base64_image,
                                    },
                                },
                                {
                                    "type": "text",
                                    "text": prompt_text,
                                },
                            ],
                        }
                    ],
                }
            ),
        )

        response_body = json.loads(response["body"].read())
        return response_body["content"][0]["text"]

    def get_prompt(self) -> str:
        secret_name = os.getenv("PETROCK_NOVA_API_SECRET_NAME")

        if secret_name is None:
            raise ValueError("PETROCK_NOVA_API_SECRET_NAME が設定されていません")

        secrets_response = self.secrets_manager_client.get_secret_value(SecretId=secret_name)
        secrets = json.loads(secrets_response["SecretString"])

        prompt_identifier = secrets["pictureDescriptionPromptIdentifier"]
        prompt_version = secrets["pictureDescriptionPromptVersion"]

        response = self.bedrock_agent_client.get_prompt(
            promptIdentifier=prompt_identifier,
            promptVersion=prompt_version,
        )

        default_variant_name = response["defaultVariant"]

        for variant in response["variants"]:
            if variant["name"] == default_variant_name:
                return variant["templateConfiguration"]["text"]["text"]

        raise ValueError("プロンプトが見つかりませんでした")

    def get_base64_image(self, s3_image_key: str) -> str:
        image_bytes = self.image_repository.get_image(s3_image_key)
        return base64.b64encode(image_bytes).decode("utf-8")
