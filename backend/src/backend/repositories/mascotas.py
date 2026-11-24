from dataclasses import dataclass
from threading import Lock

from backend.schemas.mascotas import Mascota, MascotaCreate, MascotaUpdate


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
        self._mascotas: dict[int, RegistroMascota] = {}
        self._siguiente_id = 1
        self._alta_lock = Lock()

    def list(self) -> list[Mascota]:
        return [registro.ficha for registro in self._mascotas.values()]

    def get(self, mascota_id: int) -> Mascota | None:
        registro = self._mascotas.get(mascota_id)
        return registro.ficha if registro else None

    def _guardar(self, mascota: Mascota, fotos: dict[int, FotoMascota]) -> Mascota:
        urls = {pos: f"/mascotas/{mascota.id}/fotos/{pos}" for pos in sorted(fotos)}
        ficha = mascota.model_copy(update={"fotos": urls})
        self._mascotas[ficha.id] = RegistroMascota(ficha, fotos)
        return ficha

    def add(self, datos: MascotaCreate, fotos: dict[int, FotoMascota]) -> Mascota:
        with self._alta_lock:
            mascota = Mascota(id=self._siguiente_id, **datos.model_dump())
            ficha = self._guardar(mascota, fotos.copy())
            self._siguiente_id += 1
            return ficha

    def update(
        self, mascota_id: int, datos: MascotaUpdate, cambios: dict[int, FotoMascota | None]
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

    def delete(self, mascota_id: int) -> bool:
        return self._mascotas.pop(mascota_id, None) is not None

    def get_foto(self, mascota_id: int, posicion: int) -> FotoMascota | None:
        registro = self._mascotas.get(mascota_id)
        return registro.fotos.get(posicion) if registro else None


mascota_repository = MascotaRepository()
