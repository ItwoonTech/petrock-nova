from abc import ABC, abstractmethod


class ImageRepository(ABC):
    """
    画像を保存するリポジトリのインタフェース
    """

    @abstractmethod
    def get_image(self, image_path: str) -> bytes | None:
        """
        画像を取得する

        Args:
            image_path (str): 取得する画像のパス

        Returns:
            bytes | None: 画像のバイナリデータ (見つからない場合はNone)
        """
        pass

    @abstractmethod
    def put_imaage(
        self,
        image_path: str,
        image_bytes: bytes,
    ) -> None:
        """
        画像を保存する

        Args:
            image_path (str): 保存する画像のパス
            image_bytes (bytes): 保存する画像のバイナリデータ
        """
        pass

    @abstractmethod
    def get_presigned_url(
        self,
        client_method: str,
        params: dict,
        expires_in: int = 3600,
    ) -> str:
        """
        署名付きURLを取得する

        Args:
            client_method (str): 署名付きURLによって許可する操作
            params (dict): 操作を実行する時の引数
            expires_in (int, optional): URLの有効期限 (秒単位)

        Returns:
            str: 署名付きURL
        """
        pass
