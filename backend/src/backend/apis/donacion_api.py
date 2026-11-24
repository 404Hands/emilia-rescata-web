from fastapi import APIRouter, Depends, HTTPException, status
from .inicio_sesion_api import verificar_sesion
from ..services.donacion_services import DonacionServicio
from ..schemas.donacion import DonacionNueva, DonacionActualizar

rutasDonacion = APIRouter(prefix='/donaciones', tags=['Donaciones'])

servicio = DonacionServicio()

@rutasDonacion.post('/', status_code=status.HTTP_201_CREATED)
def guardarDonacion(nueva: DonacionNueva):
    return servicio.guardarDonacion(nueva)

@rutasDonacion.get('/', dependencies=[Depends(verificar_sesion)])
def mostrarDonaciones():
    return servicio.mostrarDonaciones()

@rutasDonacion.put('/{id}', dependencies=[Depends(verificar_sesion)])
def actualizarDonacion(id: int, datos: DonacionActualizar):
    resultado = servicio.actualizarDonacion(id, datos)
    if resultado is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Donación no encontrada')
    return resultado

@rutasDonacion.delete('/{id}', dependencies=[Depends(verificar_sesion)])
def eliminarDonacion(id: int):
    resultado = servicio.eliminarDonacion(id)
    if resultado is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Donación no encontrada')
    return {'eliminado': resultado}
