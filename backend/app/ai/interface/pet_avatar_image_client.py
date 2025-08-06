from abc import ABC, abstractmethod

from app.ai.interface.pet_picture_description_client import PetPictureDescription


class PetAvatarImageClient(ABC):
    @abstractmethod
    def generate(self, description: PetPictureDescription) -> str:
        """
        アバター画像を生成する

        Args:
            description (PetPictureDescription): アバターの説明

        Returns:
            str: Base64でエンコードされたアバター画像
        """
        pass
