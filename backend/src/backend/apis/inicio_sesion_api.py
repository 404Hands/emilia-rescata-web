from fastapi import APIRouter, HTTPException, status
from ..services.inicio_sesion_services import InicioSesionServicio
from ..schemas.inicio_sesion_schema import InicioSesion

rutasInicioSesion = APIRouter(prefix='/inicio-sesion', tags=['Inicio de sesión'])

InicioSesionServicio = InicioSesionServicio()

@rutasInicioSesion.post('/')
def iniciarSesion(datos: InicioSesion):
    try:
        usuario = InicioSesionServicio.iniciarSesion(datos)
        if usuario is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Correo o contraseña incorrectos')
        return usuario
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))