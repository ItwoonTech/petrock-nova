from abc import ABC, abstractmethod


class PetPictureDescriptionClient(ABC):
    @abstractmethod
    def describe(self, s3_image_key: str) -> str:
        pass
