from datetime import date

from pydantic import BaseModel

from app.models.diary import Weather


class CreateDiaryResponseBody(BaseModel):
    category: str
    birth_date: date
    picture_name: str
    weather: Weather
    temperature: str
