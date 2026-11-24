from pydantic import BaseModel, EmailStr, Field

class InicioSesion(BaseModel):
    correo: EmailStr
    clave: str = Field(min_length=1)
    recordar: bool = False

class Registro(BaseModel):
    nombre: str = Field(min_length=1)
    correo: EmailStr
    clave: str = Field(min_length=8)

class Usuario(BaseModel):
    id: int = 0
    nombre: str
    correo: EmailStr
    claveHash: str
    rol: str

class UsuarioRespuesta(BaseModel):
    id: int
    nombre: str
    correo: EmailStr
    rol: str