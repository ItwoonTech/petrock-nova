import boto3

from app.models.user import User
from app.repositories.interface.user_repository import UserRepository


class DynamoDBUserRepository(UserRepository):
    """DynamoDBのユーザーリポジトリ"""

    def __init__(self, table_name: str, region_name: str = "ap-northeast-1"):
        """コンストラクタ

        Args:
            table_name (str): テーブル名
            region_name (str, optional): リージョン名
        """
        self.dynamodb = boto3.resource("dynamodb", region_name=region_name)
        self.table = self.dynamodb.Table(table_name)

    def get_by_id(self, user_id: str) -> User | None:
        """ユーザーを取得する

        Args:
            user_id (str): ユーザーID

        Returns:
            User | None: ユーザー（存在しない場合はNone）
        """
        response = self.table.get_item(Key={"user_id": user_id})

        if "Item" not in response:
            return None

        return User.from_dict(response["Item"])

    def create(self, user: User) -> User:
        """ユーザーを作成する

        Args:
            user (User): 作成されたユーザー
        """
        self.table.put_item(Item=user.to_dict())

        return user

    def update(self, user: User) -> User:
        """ユーザーを更新する

        Args:
            user (User): 更新されたユーザー
        """
        self.table.put_item(Item=user.to_dict())

        return user
