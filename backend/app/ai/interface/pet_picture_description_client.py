from abc import ABC, abstractmethod

from app.ai.dtos.pet_picture_description import PetPictureDescription


class PetPictureDescriptionClient(ABC):
    @abstractmethod
    def describe(self, s3_image_key: str) -> PetPictureDescription:
        """
        ペットの画像から説明文を生成する

        Args:
            s3_image_key (str): ペットの画像のS3キー

        Returns:
            PetPictureDescription: ペットの画像の説明文
        """
        pass
