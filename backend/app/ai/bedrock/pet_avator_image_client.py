import json

import boto3

from app.ai.interface.pet_avator_image_client import PetAvatorImageClient


class BedrockPetAvatorImageClient(PetAvatorImageClient):
    TITAN_MAX_PROMPT_LENGTH = 512

    def __init__(self, region_name: str = "us-east-1") -> None:
        self.bedrock_runtime_client = boto3.client("bedrock-runtime", region_name=region_name)

    def generate(self, description: str) -> str:
        try:
            titan_prompt = {
                "taskType": "TEXT_IMAGE",
                "textToImageParams": {
                    "text": description[: self.TITAN_MAX_PROMPT_LENGTH],
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
                modelId="amazon.titan-image-generator-v2:0",
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
            raise exception from Exception
