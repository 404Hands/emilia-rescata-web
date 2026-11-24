from uuid import UUID
from typing import Literal

from pydantic import BaseModel, Field


ProductoId = Literal["adultos", "cachorros", "especial", "latas", "desinfectante"]
UnidadIngreso = Literal["envase", "kg"]


class Producto(BaseModel):
    id: ProductoId
    nombre: str
    cantidad: float = Field(ge=0)
    unidad: str
    plural: str
    kgPorUnidad: float | None = Field(default=None, gt=0)
    minimo: int = Field(ge=0)
    detalle: str

class Ingreso(BaseModel):
    ingreso_id: UUID
    productoId: ProductoId
    cantidad: float
    unidad: UnidadIngreso


class ProductoConIngreso(Producto):
    ingreso_id: UUID
