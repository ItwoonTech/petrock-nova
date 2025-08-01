import json
import os

import boto3

from app.ai.interface.pet_care_notes_client import (
    CareNotesPromptVariables,
    PetCareNotesClient,
)
from app.models.pet import PetCareNote


class BedrockPetCareNotesClient(PetCareNotesClient):
    CARE_NOTE_ICONS = [
        "Dog",
        "Bone",
        "Smile",
        "Frown",
        "Utensils",
        "Cookie",
    ]

    def __init__(self, region_name: str = "ap-northeast-1") -> None:
        """
        コンストラクタ

        Args:
            region_name (str, optional): リージョン名. デフォルトは "ap-northeast-1".
        """
        self.bedrock_runtime_client = boto3.client(
            "bedrock-runtime",
            region_name=region_name,
        )
        self.secrets_manager_client = boto3.client(
            "secretsmanager",
            region_name=region_name,
        )

    def generate(self, prompt_variables: CareNotesPromptVariables) -> list[PetCareNote]:
        """
        ペットの飼育情報を生成する

        Args:
            prompt_variables (CareNotesPromptVariables): ペットの飼育情報を生成するための情報

        Returns:
            list[PetCareNote]: ペットの飼育情報
        """
        prompt_arn = self.get_prompt_arn()

        prompt_variables = {
            "category": {
                "text": prompt_variables.category,
            },
            "birth_date": {
                "text": prompt_variables.birth_date.strftime("%Y-%m-%d"),
            },
            "gender": {
                "text": prompt_variables.gender.value,
            },
            "care_note_icons": {
                "text": ", ".join(self.CARE_NOTE_ICONS),
            },
        }

        response = self.bedrock_runtime_client.invoke_model(
            modelId=prompt_arn,
            body=json.dumps(
                {
                    "promptVariables": prompt_variables,
                }
            ),
        )

        response_body = json.loads(response["body"].read())
        care_notes_text = response_body["content"][0]["text"]

        try:
            care_notes = json.loads(care_notes_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"AIからのレスポンスをJSONに変換できませんでした: {e}")

        return [
            PetCareNote(
                title=care_note["title"],
                description=care_note["description"],
                icon=care_note["icon"],
            )
            for care_note in care_notes
        ]

    def get_prompt_arn(self) -> str:
        """
        プロンプトの ARN を取得する
        """
        secret_name = os.getenv("PETROCK_NOVA_API_SECRET_NAME")

        if secret_name is None:
            raise ValueError("PETROCK_NOVA_API_SECRET_NAME が設定されていません")

        secrets_response = self.secrets_manager_client.get_secret_value(SecretId=secret_name)
        secrets = json.loads(secrets_response["SecretString"])

        return secrets["careNotesPromptArn"]
