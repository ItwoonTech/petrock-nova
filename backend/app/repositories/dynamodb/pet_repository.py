import os

import boto3

from app.models.pet import Pet
from app.repositories.interface.pet_repository import PetRepository


class DynamoDBPetRepository(PetRepository):
    """DynamoDBのペットリポジトリ"""

    def __init__(self, table_name: str, region_name: str = "ap-northeast-1"):
        """コンストラクタ

        Args:
            table_name (str): テーブル名
            region_name (str, optional): リージョン名
        """
        DYNAMODB_ENDPOINT_URL = os.getenv("DYNAMODB_ENDPOINT_URL")

        self.dynamodb = boto3.resource(
            "dynamodb",
            region_name=region_name,
            endpoint_url=DYNAMODB_ENDPOINT_URL,
        )
        self.table = self.dynamodb.Table(table_name)

    def get_by_id(self, pet_id: str) -> Pet | None:
        """ペットを取得する

        Args:
            pet_id (str): ペットID

        Returns:
            Pet | None: ペット（存在しない場合はNone）
        """
        response = self.table.get_item(Key={"pet_id": pet_id})

        if "Item" not in response:
            return None

        return Pet.from_dict(response["Item"])

    def create(self, pet: Pet) -> Pet:
        """ペットを作成する

        Args:
            pet (Pet): 作成されたペット
        """
        self.table.put_item(Item=pet.to_dict())

        return pet

    def update(self, pet: Pet) -> Pet:
        """ペットを更新する

        Args:
            pet (Pet): 更新されたペット
        """
        self.table.put_item(Item=pet.to_dict())

        return pet
