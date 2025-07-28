from abc import ABC, abstractmethod


class PetAvatorImageClient(ABC):
    @abstractmethod
    def generate(self, description: str) -> str:
        """
        アバター画像を生成する

        Args:
            description: アバターの説明

        Returns:
            str: アバター画像のURL
        """
        pass
