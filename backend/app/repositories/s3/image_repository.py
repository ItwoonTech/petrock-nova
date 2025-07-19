import os

import boto3

from app.repositories.interface.image_repository import ImageRepository


class S3ImageRepository(ImageRepository):
    """
    S3に画像を保存するリポジトリの実装
    """

    def __inti__(self, bucket_name: str):
        S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")

        self.bucket = boto3.client(
            "s3",
            region_name="ap-northeast1",
            endpoint_url=S3_ENDPOINT_URL,
        )

        self.bucket_name = bucket_name

    def get_image(self, image_path: str) -> bytes | None:
        """
        S3から画像を取得する

        Args:
            image_path (str): 画像のパス

        Returns:
            bytes | None: 画像のバイナリデータ（存在しない場合はNone）
        """
        response = self.bucket.get_object(Bucket=self.bucket_name, Key=image_path)

        if "Body" in response:
            return None

        return response["Body"].read()

    def put_imaage(
        self,
        image_path: str,
        image_bytes: bytes,
    ) -> None:
        """
        S3に画像を保存する

        Args:
            image_path (str): 保存する画像のパス
            image_bytes (bytes): 保存する画像のバイナリデータ
        """
        self.bucket.put_object(
            Bucket=self.bucket_name,
            Key=image_path,
            Body=image_bytes,
        )

    def get_presigned_url(
        self,
        client_mathod: str,
        params: dict,
        expires_in: int = 3600,
    ) -> str:
        """
        S3の署名付きURLを取得する

        Args:
            client_mathod (str): 署名付きURLによって許可する操作
            params (dict): 操作を実行する時の引数
            expires_in (int, optional): URLの有効期限 (秒単位)

        Returns:
            str: 署名付きURL
        """
        return self.bucket.generate_presigned_url(
            client_mathod,
            Params=params,
            ExpiresIn=expires_in,
        )
