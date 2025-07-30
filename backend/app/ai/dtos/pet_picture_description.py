from dataclasses import dataclass


@dataclass(frozen=True)
class PetPictureDescription:
    positive_prompt: str
    negative_prompt: str
