import boto3

from app.models.diary import Diary
from app.repositories.interface.diary_repository import DiaryRepository


class DynamoDBDiaryRepository(DiaryRepository):
    """DynamoDBの日記リポジトリ"""

    def __init__(
        self,
        table_name: str,
        dynamodb_endpoint_url: str,
        region_name: str = "ap-northeast-1",
    ):
        """コンストラクタ

        Args:
            table_name (str): テーブル名
            dynamodb_endpoint_url (str): DynamoDBのエンドポイントURL
            region_name (str, optional): リージョン名
        """
        self.dynamodb = boto3.resource(
            "dynamodb",
            region_name=region_name,
            endpoint_url=dynamodb_endpoint_url,
        )

        self.table = self.dynamodb.Table(table_name)

    def get_by_id(self, pet_id: str, date: str) -> Diary | None:
        """日記を取得する

        Args:
            pet_id (str): 日記ID
            date (str): 日付

        Returns:
            Diary | None: 日記
        """
        response = self.table.get_item(Key={"pet_id": pet_id, "date": date})

        if "Item" not in response:
            return None

        return Diary.from_dict(response["Item"])

    def create(self, diary: Diary) -> Diary:
        """日記を作成する

        Args:
            diary (Diary): 日記
        """
        self.table.put_item(Item=diary.to_dict())

        return diary

    def update(self, diary: Diary) -> Diary:
        """日記を更新する

        Args:
            diary (Diary): 日記
        """
        self.table.put_item(Item=diary.to_dict())

        return diary
