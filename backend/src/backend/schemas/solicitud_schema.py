from typing import Literal
from pydantic import BaseModel, Field

class Solicitud(BaseModel):
    id: int = 0
    nombre: str = Field(min_length=1)
    celular: str = Field(pattern=r'^\d{9}$')
    distrito: str = Field(min_length=1)
    tipoVivienda: str = Field(min_length=1)
    propiedadVivienda: str = Field(min_length=1)
    hayNinos: str = Field(min_length=1)
    otrasMascotas: str = Field(min_length=1)
    motivo: str = Field(min_length=1)
    tiempoDisponible: str = Field(min_length=1)
    compromiso: Literal[True]