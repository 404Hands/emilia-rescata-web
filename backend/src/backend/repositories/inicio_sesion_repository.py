from ..schemas.inicio_sesion_schema import Usuario

class InicioSesionRepositorio:
    def __init__(self):
        self.__listaUsuarios: list[Usuario] = []
        self.__ultimoId = 0

    def guardarUsuario(self, usuarioNuevo: Usuario):
        try:
            self.__ultimoId += 1
            usuarioNuevo.id = self.__ultimoId
            self.__listaUsuarios.append(usuarioNuevo)
            return usuarioNuevo
        except Exception as e:
            raise e

    def buscarPorCorreo(self, correo: str):
        try:
            for valor in self.__listaUsuarios:
                if valor.correo.lower() == correo.lower():
                    return valor
            return None
        except Exception as e:
            raise e