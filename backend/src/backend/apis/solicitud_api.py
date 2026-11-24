from fastapi import APIRouter, HTTPException, status
from ..services.solicitud_services import SolicitudServicio
from ..schemas.solicitud_schema import Solicitud

rutasSolicitud = APIRouter(prefix='/solicitudes', tags=['Solicitudes'])

SolicitudServicio = SolicitudServicio()

@rutasSolicitud.post('/')
def guardarSolicitud(solicitudNueva: Solicitud):
    try:
        return SolicitudServicio.guardarSolicitud(solicitudNueva)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@rutasSolicitud.get('/')
def mostrarSolicitudes():
    return SolicitudServicio.mostrarSolicitudes()

@rutasSolicitud.delete('/{id}')
def eliminarSolicitud(id: int):
    try:
        return SolicitudServicio.eliminarSolicitud(id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))