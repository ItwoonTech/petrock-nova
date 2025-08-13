import base64
import json

import boto3

from app.ai.interface.pet_care_advice_client import (
    CareAdvicePromptVariables,
    PetCareAdviceClient,
)
from app.exceptions.image_not_found_exception import ImageNotFoundException
from app.exceptions.prompt_not_found_exception import PromptNotFoundException
from app.repositories.interface.image_repository import ImageRepository


class BedrockPetCareAdviceClient(PetCareAdviceClient):
    MODEL_ID = "apac.anthropic.claude-3-7-sonnet-20250219-v1:0"

    def __init__(
        self,
        secret_name: str,
        image_repository: ImageRepository,
        region_name: str = "ap-northeast-1",
    ):
        """
        コンストラクタ

        Args:
            secret_name (str): プロンプトの情報が入ったシークレット名
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

        self.secret_name = secret_name
        self.image_repository = image_repository

    def generate(
        self,
        prompt_variables: CareAdvicePromptVariables,
        pet_picture_key: str,
    ) -> str:
        """
        飼育アドバイスを生成する

        Args:
            prompt_variables (CareAdvicePromptVariables): プロンプトに埋め込む変数
            pet_picture_key (str): ペットの画像へのパス

        Returns:
            str: 飼育アドバイス
        """
        prompt_template = self.get_prompt()

        prompt_text = prompt_template.format(
            birth_date=prompt_variables.birth_date.isoformat(),
            category=prompt_variables.category,
            date=prompt_variables.date.isoformat(),
            weather=prompt_variables.weather.value,
            temperature=prompt_variables.temperature,
        )

        base64_pet_picture = self.get_base64_image(pet_picture_key)

        response = self.bedrock_runtime_client.invoke_model(
            modelId=self.MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=json.dumps(
                {
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 1000,
                    "temperature": 0.5,
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image",
                                    "source": {
                                        "type": "base64",
                                        "media_type": "image/jpeg",  # FIXME: ペットの画像がJPEGとは限らない
                                        "data": base64_pet_picture,
                                    },
                                },
                                {
                                    "type": "text",
                                    "text": prompt_text,
                                },
                            ],
                        },
                    ],
                }
            ),
        )

        response_body = json.loads(response["body"].read())
        advice_text = response_body["content"][0]["text"]

        return advice_text

    def get_prompt(self) -> str:
        """
        飼育アドバイスを生成するためのプロンプトを取得する

        Returns:
            str: 飼育アドバイスを生成するためのプロンプト
        """
        secrets_response = self.secrets_manager_client.get_secret_value(SecretId=self.secret_name)
        secrets = json.loads(secrets_response["SecretString"])

        prompt_identifier = secrets["petCareAdvicePromptIdentifier"]
        prompt_version = secrets["petCareAdvicePromptVersion"]

        response = self.bedrock_agent_client.get_prompt(
            promptIdentifier=prompt_identifier,
            promptVersion=prompt_version,
        )

        default_variant_name = response["defaultVariant"]

        for variant in response["variants"]:
            if variant["name"] == default_variant_name:
                return variant["templateConfiguration"]["text"]["text"]

        raise PromptNotFoundException("プロンプトが見つかりませんでした")

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
        image_bytes = self.image_repository.get_by_key(s3_image_key)

        if image_bytes is None:
            raise ImageNotFoundException(f"画像が見つかりませんでした: {s3_image_key}")

        return base64.b64encode(image_bytes).decode("utf-8")
