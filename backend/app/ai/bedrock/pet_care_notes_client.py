import json

import boto3

from app.ai.interface.pet_care_notes_client import (
    CareNotesPromptVariables,
    PetCareNotesClient,
)
from app.exceptions.care_notes_generaton_exception import CareNotesGenerationException
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

    def __init__(self, secret_name: str, region_name: str = "ap-northeast-1") -> None:
        """
        コンストラクタ

        Args:
            secret_name (str): プロンプトの情報が入ったシークレット名
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

        self.secret_name = secret_name

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
                "text": prompt_variables.birth_date.isoformat(),
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
            raise CareNotesGenerationException(
                f"AIからのレスポンスをJSONに変換できませんでした: {e}"
            ) from e

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

        Returns:
            str: プロンプトの ARN
        """
        secrets_response = self.secrets_manager_client.get_secret_value(SecretId=self.secret_name)
        secrets = json.loads(secrets_response["SecretString"])

        return secrets["careNotesPromptArn"]
