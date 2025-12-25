from pydantic import BaseModel

class HouseInput(BaseModel):
    area: float
    bedrooms: int
    bathrooms: int
    location: str
