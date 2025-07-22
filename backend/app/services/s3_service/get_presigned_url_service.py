from typing import Literal

from pydantic import BaseModel

from app.repositories.interface.image_repository import ImageRepository


class GetPresignedUrlServiceRequest(BaseModel):
    pet_id: str
    file_name: str
    http_method: Literal["get", "post"]


class GetPresignedUrlServiceResponse(BaseModel):
    presigned_url: str


class GetPresignedUrlService:
    http_method_to_client_method = {
        "get": "get_object",
        "post": "put_object",
    }

    def __init__(self, image_repository: ImageRepository):
        self.image_repository = image_repository

    def execute(self, request: GetPresignedUrlServiceRequest) -> GetPresignedUrlServiceResponse:
        presigned_url = self.image_repository.get_presigned_url(
            self.http_method_to_client_method[request.http_method],
            f"{request.pet_id}/{request.file_name}",
        )

        return GetPresignedUrlServiceResponse(presigned_url=presigned_url)
