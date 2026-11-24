import os
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from ..repositories.inicio_sesion_repository import InicioSesionRepositorio
from ..schemas.inicio_sesion_schema import InicioSesion, Registro, Usuario, UsuarioRespuesta


def secreto_jwt() -> str:
    secreto = os.getenv("JWT_SECRET", "")
    if len(secreto.encode()) < 32:
        raise RuntimeError("Configura JWT_SECRET con al menos 32 bytes en backend/.env.")
    return secreto


class InicioSesionServicio:
    def __init__(self):
        self.__inicioSesionRepositorio = InicioSesionRepositorio()
        self.__argon2 = PasswordHasher()

    def iniciarSesion(self, datos: InicioSesion):
        usuario = self.__inicioSesionRepositorio.buscarPorCorreo(datos.correo)
        if usuario is None:
            return None
        try:
            self.__argon2.verify(usuario.claveHash, datos.clave)
        except VerifyMismatchError:
            return None

        duracion = timedelta(days=7) if datos.recordar else timedelta(hours=1)
        vence = (datetime.now(timezone.utc) + duracion).replace(microsecond=0)
        sesion_id = secrets.token_hex(32)
        token = jwt.encode(
            {"sub": str(usuario.id), "jti": sesion_id, "exp": vence},
            secreto_jwt(), algorithm="HS256",
        )
        self.__inicioSesionRepositorio.guardarSesion(
            sesion_id, usuario.id, vence.replace(tzinfo=None)
        )
        respuesta = UsuarioRespuesta.model_validate(usuario.model_dump())
        return {**respuesta.model_dump(), "token": token}

    def registrarUsuario(self, datos: Registro):
        if self.__inicioSesionRepositorio.buscarPorCorreo(datos.correo) is not None:
            return None
        usuario = self.__inicioSesionRepositorio.guardarUsuario(Usuario(
            nombre=datos.nombre,
            correo=datos.correo,
            claveHash=self.__argon2.hash(datos.clave),
            rol="Usuario",
        ))
        return UsuarioRespuesta.model_validate(usuario.model_dump()) if usuario else None

    def verificarSesion(self, token: str):
        try:
            datos = jwt.decode(
                token, secreto_jwt(), algorithms=["HS256"],
                options={"require": ["sub", "jti", "exp"]},
            )
            usuario_id = int(datos["sub"])
        except (jwt.InvalidTokenError, ValueError):
            return None

        sesion_id = datos["jti"]
        if self.__inicioSesionRepositorio.sesionActiva(sesion_id, usuario_id):
            return sesion_id, usuario_id
        return None

    def cerrarSesion(self, sesion_id: str, usuario_id: int):
        self.__inicioSesionRepositorio.cerrarSesion(sesion_id, usuario_id)
