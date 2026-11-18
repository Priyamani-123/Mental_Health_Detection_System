from pydantic import BaseModel, EmailStr, Field
from typing import Literal

class RegisterRequest(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6)
    age:int
    gender:str
    role: Literal["student", "staff", "general", "admin"]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"