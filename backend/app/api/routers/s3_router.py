from typing import Literal

from fastapi import APIRouter, Depends

from app.api.dependencies import get_get_presigned_url_service
from app.services.s3_service.get_presigned_url_service import (
    GetPresignedUrlService,
    GetPresignedUrlServiceRequest,
    GetPresignedUrlServiceResponse,
)

router = APIRouter()


@router.post(
    "/presigned-url",
    response_model=GetPresignedUrlServiceResponse,
    tags=["S3"],
    summary="署名付きURLを取得する",
    operation_id="get_presigned_url",
)
def get_presigned_url(
    pet_id: str,
    file_name: str,
    http_method: Literal["get", "post"] = "get",
    get_presigned_url_service: GetPresignedUrlService = Depends(get_get_presigned_url_service),
):
    request = GetPresignedUrlServiceRequest(
        pet_id=pet_id,
        file_name=file_name,
        http_method=http_method,
    )

    return get_presigned_url_service.execute(request)
