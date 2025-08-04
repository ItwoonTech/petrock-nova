import json

import boto3

from app.ai.interface.pet_avatar_image_client import PetAvatarImageClient
from app.ai.interface.pet_picture_description_client import PetPictureDescription


class BedrockPetAvatarImageClient(PetAvatarImageClient):
    MODEL_ID = "amazon.titan-image-generator-v2:0"
    TITAN_MAX_PROMPT_LENGTH = 512

    def __init__(self, region_name: str = "us-east-1") -> None:
        """
        コンストラクタ

        Args:
            region_name (str, optional): リージョン名. デフォルトは "us-east-1".
        """
        self.bedrock_runtime_client = boto3.client("bedrock-runtime", region_name=region_name)

    def generate(self, description: PetPictureDescription) -> str:
        """
        アバター画像を生成する

        Args:
            description (PetPictureDescription): アバターの説明

        Raises:
            Exception: 画像生成に失敗しました

        Returns:
            str: Base64でエンコードされたアバター画像

        Notes:
            S3に保存する前にBase64でデコードする
        """
        try:
            positive_prompt = description.positive_prompt[: self.TITAN_MAX_PROMPT_LENGTH]
            negative_prompt = description.negative_prompt[: self.TITAN_MAX_PROMPT_LENGTH]

            titan_prompt = {
                "taskType": "TEXT_IMAGE",
                "textToImageParams": {
                    "text": positive_prompt,
                    "negativeText": negative_prompt,
                },
                "imageGenerationConfig": {
                    "cfgScale": 8.0,
                    "seed": 0,
                    "quality": "standard",
                    "width": 512,
                    "height": 512,
                },
            }
            response = self.bedrock_runtime_client.invoke_model(
                modelId=self.MODEL_ID,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(titan_prompt),
            )

            response_body = json.loads(response["body"].read())

            if "images" not in response_body:
                raise Exception("画像生成に失敗しました: レスポンスに画像が含まれていません")

            if not response_body["images"]:
                raise Exception("画像生成に失敗しました: レスポンスの画像が空です")

            return response_body["images"][0]
        except Exception as exception:
            raise exception
