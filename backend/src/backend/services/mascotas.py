from threading import Lock
from uuid import UUID, uuid4

from backend.repositories.mascotas import (
    FotoMascota,
    MascotaRepository,
    mascota_repository,
)
from backend.schemas.mascotas import Mascota, MascotaCreate, MascotaUpdate
from backend.services.exceptions import (
    FotoNotFoundError,
    MascotaNotFoundError,
)


class MascotaService:
    """Gestiona las fichas de las mascotas y sus fotos."""

    def __init__(self, repository: MascotaRepository | None = None) -> None:
        self._repository = repository if repository is not None else mascota_repository
        self._lock = Lock()

    def listar(self) -> list[Mascota]:
        with self._lock:
            return self._repository.list()

    def obtener(self, mascota_id: UUID) -> Mascota:
        mascota = self._repository.get(mascota_id)
        if mascota is None:
            raise MascotaNotFoundError(mascota_id)
        return mascota

    def crear(self, datos: MascotaCreate, fotos: dict[int, FotoMascota]) -> Mascota:
        mascota = Mascota(id=uuid4(), **datos.model_dump())
        with self._lock:
            return self._repository.add(mascota, fotos)

    def obtener_foto(self, mascota_id: UUID, posicion: int) -> FotoMascota:
        with self._lock:
            return self._obtener_foto(mascota_id, posicion)

    def _obtener_foto(self, mascota_id: UUID, posicion: int) -> FotoMascota:
        self.obtener(mascota_id)
        foto = self._repository.get_foto(mascota_id, posicion)
        if foto is None:
            raise FotoNotFoundError(posicion)
        return foto

    def actualizar(
        self, mascota_id: UUID, datos: MascotaUpdate, cambios: dict[int, FotoMascota | None]
    ) -> Mascota:
        with self._lock:
            actualizada = self._repository.update(mascota_id, datos, cambios)
        if actualizada is None:
            raise MascotaNotFoundError(mascota_id)
        return actualizada

    def eliminar(self, mascota_id: UUID) -> None:
        with self._lock:
            if not self._repository.delete(mascota_id):
                raise MascotaNotFoundError(mascota_id)


mascota_service = MascotaService()