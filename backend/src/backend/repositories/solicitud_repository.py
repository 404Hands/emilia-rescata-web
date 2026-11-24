from ..schemas.solicitud_schema import Solicitud

class SolicitudRepositorio:
    def __init__(self):
        self.__listaSolicitudes: list[Solicitud] = []
        self.__ultimoId = 0

    def guardarSolicitud(self, solicitudNueva: Solicitud):
        try:
            self.__ultimoId += 1
            solicitudNueva.id = self.__ultimoId
            self.__listaSolicitudes.append(solicitudNueva)
            return solicitudNueva
        except Exception as e:
            raise e

    def mostrarSolicitudes(self):
        return self.__listaSolicitudes

    def eliminarSolicitud(self, id: int):
        try:
            for indice, valor in enumerate(self.__listaSolicitudes):
                if valor.id == id:
                    self.__listaSolicitudes.pop(indice)
                    return id
            return None
        except Exception as e:
            raise e