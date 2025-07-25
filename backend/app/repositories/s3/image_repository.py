import os

import boto3

from app.repositories.interface.image_repository import ImageRepository


class S3ImageRepository(ImageRepository):
    """
    S3に画像を保存するリポジトリの実装
    """

    def __init__(self, bucket_name: str, region_name: str = "ap-northeast-1"):
        """コンストラクタ

        Args:
            bucket_name (str): バケット名
            region_name (str, optional): リージョン名
        """
        S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")

        self.bucket = boto3.client(
            "s3",
            region_name=region_name,
            endpoint_url=S3_ENDPOINT_URL,
        )

        self.bucket_name = bucket_name

    def get_image(self, image_key: str) -> bytes | None:
        """
        S3から画像を取得する

        Args:
            image_key (str): 画像のキー

        Returns:
            bytes | None: 画像のバイナリデータ（存在しない場合はNone）
        """
        response = self.bucket.get_object(Bucket=self.bucket_name, Key=image_key)

        if "Body" not in response:
            return None

        return response["Body"].read()

    def put_image(
        self,
        image_key: str,
        image_bytes: bytes,
    ) -> None:
        """
        S3に画像を保存する

        Args:
            image_key (str): 保存する画像のキー
            image_bytes (bytes): 保存する画像のバイナリデータ
        """
        self.bucket.put_object(
            Bucket=self.bucket_name,
            Key=image_key,
            Body=image_bytes,
        )

    def get_presigned_url(
        self,
        client_method: str,
        image_key: str,
        expires_in: int = 3600,
        http_method: str = None,
    ) -> str:
        """
        S3の署名付きURLを取得する

        Args:
            client_method (str): 署名付きURLによって許可する操作
            image_key (str): アクセスする画像のキー
            expires_in (int, optional): URLの有効期限 (秒単位)
            http_method (str, optional): 署名付きURLによって許可するHTTPメソッド

        Returns:
            str: 署名付きURL
        """
        return self.bucket.generate_presigned_url(
            client_method,
            Params={
                "Bucket": self.bucket_name,
                "Key": image_key,
            },
            ExpiresIn=expires_in,
            HttpMethod=http_method,
        )
