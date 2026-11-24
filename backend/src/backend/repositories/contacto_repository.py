from ..schemas.contacto_schema import Contacto

class ContactoRepositorio:
    def __init__(self):
        self.__listaContactos: list[Contacto] = []
        self.__ultimoId = 0

    def guardarContacto(self, contactoNuevo: Contacto):
        try:
            self.__ultimoId += 1
            contactoNuevo.id = self.__ultimoId
            self.__listaContactos.append(contactoNuevo)
            return contactoNuevo
        except Exception as e:
            raise e

    def mostrarContactos(self):
        return self.__listaContactos

    def eliminarContacto(self, id: int):
        try:
            for indice, valor in enumerate(self.__listaContactos):
                if valor.id == id:
                    self.__listaContactos.pop(indice)
                    return id
            return None
        except Exception as e:
            raise e