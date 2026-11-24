from ..repositories.donacion_repository import DonacionRepositorio
from ..schemas.donacion import DonacionNueva, DonacionActualizar

class DonacionServicio:
    def __init__(self):
        self.__repositorio = DonacionRepositorio()

    def guardarDonacion(self, nueva: DonacionNueva):
        return self.__repositorio.guardarDonacion(nueva)

    def mostrarDonaciones(self):
        return self.__repositorio.mostrarDonaciones()

    def actualizarDonacion(self, id: int, datos: DonacionActualizar):
        return self.__repositorio.actualizarDonacion(id, datos)

    def eliminarDonacion(self, id: int):
        return self.__repositorio.eliminarDonacion(id)