from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ..schemas.inicio_sesion_schema import InicioSesion, Registro, SesionRespuesta, UsuarioRespuesta
from ..services.inicio_sesion_services import InicioSesionServicio

rutasInicioSesion = APIRouter(prefix="/inicio-sesion", tags=["Inicio de sesión"])
servicio = InicioSesionServicio()
portador = HTTPBearer(auto_error=False)


def verificar_sesion(
    credenciales: Annotated[HTTPAuthorizationCredentials | None, Depends(portador)],
) -> tuple[str, int]:
    sesion = servicio.verificarSesion(credenciales.credentials) if credenciales else None
    if sesion is None:
        raise HTTPException(401, detail="Sesión inválida o vencida", headers={"WWW-Authenticate": "Bearer"})
    return sesion


@rutasInicioSesion.post("/", response_model=SesionRespuesta)
def iniciarSesion(datos: InicioSesion):
    usuario = servicio.iniciarSesion(datos)
    if usuario is None:
        raise HTTPException(401, detail="Correo o contraseña incorrectos")
    return usuario


@rutasInicioSesion.post("/registro", response_model=UsuarioRespuesta, status_code=status.HTTP_201_CREATED)
def registrarUsuario(datos: Registro):
    usuario = servicio.registrarUsuario(datos)
    if usuario is None:
        raise HTTPException(409, detail="Ya existe una cuenta con ese correo")
    return usuario


@rutasInicioSesion.post("/salir", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def cerrarSesion(sesion: Annotated[tuple[str, int], Depends(verificar_sesion)]):
    servicio.cerrarSesion(*sesion)
