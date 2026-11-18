from pydantic import BaseModel, EmailStr
from typing import Optional

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    age: Optional[int]
    gender: Optional[str]

    class Config:
        from_attributes = True