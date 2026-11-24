from pydantic import BaseModel, EmailStr, Field

class InicioSesion(BaseModel):
    correo: EmailStr
    clave: str = Field(min_length=1)
    recordar: bool = False

class Usuario(BaseModel):
    id: int
    nombre: str
    correo: EmailStr
    claveHash: str
    rol: str

class UsuarioRespuesta(BaseModel):
    id: int
    nombre: str
    correo: EmailStr
    rol: str