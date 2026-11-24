from dataclasses import dataclass
from uuid import UUID

from backend.schemas.mascotas import Mascota, MascotaUpdate


@dataclass(frozen=True)
class FotoMascota:
    contenido: bytes
    tipo: str


@dataclass
class RegistroMascota:
    ficha: Mascota
    fotos: dict[int, FotoMascota]


class MascotaRepository:
    """Guarda en memoria cada ficha junto con sus fotos."""

    def __init__(self) -> None:
        self._mascotas: dict[UUID, RegistroMascota] = {}

    def list(self) -> list[Mascota]:
        return [registro.ficha for registro in self._mascotas.values()]

    def get(self, mascota_id: UUID) -> Mascota | None:
        registro = self._mascotas.get(mascota_id)
        return registro.ficha if registro else None

    def _guardar(self, mascota: Mascota, fotos: dict[int, FotoMascota]) -> Mascota:
        urls = {pos: f"/mascotas/{mascota.id}/fotos/{pos}" for pos in sorted(fotos)}
        ficha = mascota.model_copy(update={"fotos": urls})
        self._mascotas[ficha.id] = RegistroMascota(ficha, fotos)
        return ficha

    def add(self, mascota: Mascota, fotos: dict[int, FotoMascota]) -> Mascota:
        return self._guardar(mascota, fotos.copy())

    def update(
        self, mascota_id: UUID, datos: MascotaUpdate, cambios: dict[int, FotoMascota | None]
    ) -> Mascota | None:
        registro = self._mascotas.get(mascota_id)
        if registro is None:
            return None

        fotos = registro.fotos.copy()
        for posicion, foto in cambios.items():
            if foto is None:
                fotos.pop(posicion, None)
            else:
                fotos[posicion] = foto

        ficha = Mascota(id=mascota_id, **datos.model_dump())
        return self._guardar(ficha, fotos)

    def delete(self, mascota_id: UUID) -> bool:
        return self._mascotas.pop(mascota_id, None) is not None

    def get_foto(self, mascota_id: UUID, posicion: int) -> FotoMascota | None:
        registro = self._mascotas.get(mascota_id)
        return registro.fotos.get(posicion) if registro else None


mascota_repository = MascotaRepository()
