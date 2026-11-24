from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RasgosMascota(BaseModel):
    amigable: bool = False
    jugueton: bool = False
    timido: bool = False
    carinoso: bool = False
    protector: bool = False
    obediente: bool = False
    tranquilo: bool = False
    inteligente: bool = False


class MascotaBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    nombre: str = Field(min_length=1)
    raza: str = Field(min_length=1)
    edad: int = Field(ge=0)

    sexo: Literal["", "macho", "hembra"] = ""
    tamano: Literal["", "pequeno", "mediano", "grande"] = ""
    historia: str = ""

    vacunado: bool = False
    desparasitado: bool = False
    esterilizado: bool = False
    rasgos: RasgosMascota = Field(default_factory=RasgosMascota)


class MascotaCreate(MascotaBase):
    """Datos para registrar una mascota."""


class MascotaUpdate(MascotaBase):
    """Datos para editar la ficha completa."""


class Mascota(MascotaBase):
    """Ficha registrada con su identificador y las rutas de sus fotos."""

    id: UUID
    fotos: dict[int, str] = Field(default_factory=dict)