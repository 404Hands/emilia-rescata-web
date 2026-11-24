from ..repositories.solicitud_repository import SolicitudRepositorio
from ..schemas.solicitud_schema import Solicitud

class SolicitudServicio:
    def __init__(self):
        self.__solicitudRepositorio = SolicitudRepositorio()

    def guardarSolicitud(self, solicitudNueva: Solicitud):
        try:
            return self.__solicitudRepositorio.guardarSolicitud(solicitudNueva)
        except Exception as e:
            raise e

    def mostrarSolicitudes(self):
        return self.__solicitudRepositorio.mostrarSolicitudes()

    def eliminarSolicitud(self, id: int):
        try:
            return self.__solicitudRepositorio.eliminarSolicitud(id)
        except Exception as e:
            raise e