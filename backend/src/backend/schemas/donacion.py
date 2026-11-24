from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field

MetodoPago = Literal['BCP', 'Banco de la Nación', 'BBVA', 'PayPal']
EstadoDonacion = Literal['Pendiente', 'Confirmada', 'Rechazada']

class DonacionNueva(BaseModel):
    monto: float = Field(gt=0)
    metodoPago: MetodoPago
    nombre: str
    apellidos: str
    correo: str
    telefono: str
    direccion: str
    ciudad: str
    provincia: str
    codigoPostal: str = ''

class Donacion(DonacionNueva):
    id: int
    fecha: datetime
    estado: EstadoDonacion = 'Pendiente'

class DonacionActualizar(BaseModel):
    estado: EstadoDonacion