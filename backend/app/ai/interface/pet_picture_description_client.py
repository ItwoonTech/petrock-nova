from abc import ABC, abstractmethod


class PetPictureDescriptionClient(ABC):
    @abstractmethod
    def describe(self, s3_image_key: str) -> str:
        """
        ペットの画像から説明文を生成する

        Args:
            s3_image_key (str): ペットの画像のS3キー

        Returns:
            str: ペットの画像の説明文
        """
        pass
