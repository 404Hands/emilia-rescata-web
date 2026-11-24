from uuid import UUID


class MascotaNotFoundError(Exception):
    def __init__(self, mascota_id: UUID) -> None:
        self.mascota_id = mascota_id
        super().__init__(f"No existe una mascota con el ID '{mascota_id}'.")


class FotoNotFoundError(Exception):
    def __init__(self, posicion: int) -> None:
        super().__init__(f"No hay una foto en la posición {posicion}.")