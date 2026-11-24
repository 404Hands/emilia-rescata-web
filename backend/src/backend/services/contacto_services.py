from ..repositories.contacto_repository import ContactoRepositorio
from ..schemas.contacto_schema import Contacto

class ContactoServicio:
    def __init__(self):
        self.__contactoRepositorio = ContactoRepositorio()

    def guardarContacto(self, contactoNuevo: Contacto):
        try:
            return self.__contactoRepositorio.guardarContacto(contactoNuevo)
        except Exception as e:
            raise e

    def mostrarContactos(self):
        return self.__contactoRepositorio.mostrarContactos()

    def eliminarContacto(self, id: int):
        try:
            return self.__contactoRepositorio.eliminarContacto(id)
        except Exception as e:
            raise e