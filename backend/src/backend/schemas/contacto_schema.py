from pydantic import BaseModel, EmailStr, Field

class Contacto(BaseModel):
    id: int = 0
    nombre: str = Field(min_length=1)
    ciudad: str = ''
    correo: EmailStr
    telefono: str = ''
    mensaje: str = Field(min_length=1)