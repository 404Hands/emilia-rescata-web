from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


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

class IngresoDatos(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [{"productoId": "adultos", "cantidad": 20, "unidad": "kg"}]
        }
    )

    productoId: ProductoId
    cantidad: float = Field(gt=0, allow_inf_nan=False)
    unidad: UnidadIngreso = "envase"


class Ingreso(BaseModel):
    ingreso_id: int = Field(gt=0)
    productoId: ProductoId
    cantidad: float
    unidad: UnidadIngreso


class ProductoConIngreso(Producto):
    ingreso_id: int = Field(gt=0)
