import base64
import json
import os

import boto3

from app.ai.interface.pet_picture_description_client import (
    PetPictureDescription,
    PetPictureDescriptionClient,
)
from app.repositories.interface.image_repository import ImageRepository


class BedrockPetPictureDescriptionClient(PetPictureDescriptionClient):
    MODEL_ID = "apac.anthropic.claude-3-7-sonnet-20250219-v1:0"

    def __init__(self, image_repository: ImageRepository, region_name: str = "ap-northeast-1"):
        """コンストラクタ

        Args:
            image_repository (ImageRepository): 画像リポジトリ
            region_name (str, optional): リージョン名. デフォルトは "ap-northeast-1".
        """
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
        """
        画像の説明文を生成する

        Args:
            s3_image_key (str): 画像の S3 キー

        Returns:
            str: 画像の説明文
        """
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
        description_text = response_body["content"][0]["text"]

        try:
            description_dict = json.loads(description_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"AIからのレスポンスをJSONに変換できませんでした: {e}")

        return PetPictureDescription(
            positive_prompt=description_dict["positive_prompt"],
            negative_prompt=description_dict["negative_prompt"],
        )

    def get_prompt(self) -> str:
        """
        画像の説明文を生成するためのプロンプトを取得する

        Returns:
            str: 画像の説明文を生成するためのプロンプト
        """
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
        """
        画像を base64 エンコードして文字列に変換する

        Args:
            s3_image_key (str): 画像の S3 キー

        Returns:
            str: base64 エンコードされた画像の文字列

        Raises:
            ValueError: 画像が見つからない場合
        """
        image_bytes = self.image_repository.get_image(s3_image_key)

        if image_bytes is None:
            raise ValueError(f"画像が見つかりませんでした: {s3_image_key}")

        return base64.b64encode(image_bytes).decode("utf-8")
