import hashlib
import hmac
import secrets
from ..repositories.inicio_sesion_repository import InicioSesionRepositorio
from ..schemas.inicio_sesion_schema import InicioSesion, Usuario, UsuarioRespuesta

class InicioSesionServicio:
    def __init__(self):
        self.__inicioSesionRepositorio = InicioSesionRepositorio()
        self.__inicioSesionRepositorio.guardarUsuario(Usuario(
            id=1,
            nombre='Emilia',
            correo='EmiliaRescata@gmail.com',
            claveHash=self.__hashearClave('Emilia123'),
            rol='Administradora'
        ))

    def __hashearClave(self, clave: str):
        sal = secrets.token_hex(16)
        claveHasheada = hashlib.pbkdf2_hmac('sha256', clave.encode(), bytes.fromhex(sal), 600000)
        return sal + '$' + claveHasheada.hex()

    def __verificarClave(self, clave: str, claveHash: str):
        sal, hashGuardado = claveHash.split('$')
        claveHasheada = hashlib.pbkdf2_hmac('sha256', clave.encode(), bytes.fromhex(sal), 600000)
        return hmac.compare_digest(claveHasheada.hex(), hashGuardado)

    def iniciarSesion(self, datos: InicioSesion):
        try:
            usuario = self.__inicioSesionRepositorio.buscarPorCorreo(datos.correo)
            if usuario is None or not self.__verificarClave(datos.clave, usuario.claveHash):
                return None
            return UsuarioRespuesta(
                id=usuario.id,
                nombre=usuario.nombre,
                correo=usuario.correo,
                rol=usuario.rol
            )
        except Exception as e:
            raise e