from abc import ABC, abstractmethod

from app.ai.dtos.pet_picture_description import PetPictureDescription


class PetAvatarImageClient(ABC):
    @abstractmethod
    def generate(self, description: PetPictureDescription) -> str:
        """
        アバター画像を生成する

        Args:
            PetPictureDescription: アバターの説明

        Returns:
            str: アバター画像のURL
        """
        pass
