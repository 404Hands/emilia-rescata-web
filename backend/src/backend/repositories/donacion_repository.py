from datetime import datetime
from ..schemas.donacion import Donacion, DonacionNueva, DonacionActualizar

class DonacionRepositorio:
    def __init__(self):
        self.__lista: list[Donacion] = []
        self.__siguienteId = 1

    def guardarDonacion(self, nueva: DonacionNueva):
        donacion = Donacion(id=self.__siguienteId, fecha=datetime.now(), **nueva.model_dump())
        self.__siguienteId += 1
        self.__lista.append(donacion)
        return donacion

    def mostrarDonaciones(self):
        return self.__lista

    def actualizarDonacion(self, id: int, datos: DonacionActualizar):
        for donacion in self.__lista:
            if donacion.id == id:
                donacion.estado = datos.estado
                return donacion
        return None

    def eliminarDonacion(self, id: int):
        for indice, donacion in enumerate(self.__lista):
            if donacion.id == id:
                self.__lista.pop(indice)
                return id
        return None