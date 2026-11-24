from dataclasses import dataclass

from backend.database import conectar, filas
from backend.schemas.mascotas import Mascota, MascotaCreate, MascotaUpdate, RasgosMascota


@dataclass(frozen=True)
class FotoMascota:
    contenido: bytes
    tipo: str


CAMPOS_FICHA = (
    "nombre", "raza", "especie", "edad", "sexo", "tamano", "historia",
    "vacunado", "desparasitado", "esterilizado",
)
CAMPOS_RASGOS = tuple(RasgosMascota.model_fields)
COLUMNAS = CAMPOS_FICHA + CAMPOS_RASGOS


def valores_ficha(datos: MascotaCreate | MascotaUpdate) -> list:
    return [getattr(datos, campo) for campo in CAMPOS_FICHA] + [
        getattr(datos.rasgos, campo) for campo in CAMPOS_RASGOS
    ]


class MascotaRepository:
    def _consultar(self, cursor, mascota_id: int | None = None) -> list[Mascota]:
        consulta = """SELECT m.*, f.posicion
                      FROM dbo.Mascotas m LEFT JOIN dbo.FotosMascota f
                        ON f.mascotaId = m.id"""
        if mascota_id is not None:
            cursor.execute(consulta + " WHERE m.id = ? ORDER BY f.posicion", mascota_id)
        else:
            cursor.execute(consulta + " ORDER BY m.id, f.posicion")

        fichas = {}
        for fila in filas(cursor):
            id = fila["id"]
            posicion = fila.pop("posicion")
            if id not in fichas:
                rasgos = {campo: fila.pop(campo) for campo in CAMPOS_RASGOS}
                fichas[id] = Mascota(**fila, rasgos=rasgos)
            if posicion is not None:
                fichas[id].fotos[posicion] = f"/mascotas/{id}/fotos/{posicion}"
        return list(fichas.values())

    def list(self) -> list[Mascota]:
        with conectar() as cursor:
            return self._consultar(cursor)

    def get(self, mascota_id: int) -> Mascota | None:
        with conectar() as cursor:
            resultado = self._consultar(cursor, mascota_id)
            return resultado[0] if resultado else None

    def _guardar_fotos(self, cursor, mascota_id: int, cambios: dict[int, FotoMascota | None]):
        for posicion, foto in cambios.items():
            cursor.execute(
                "DELETE FROM dbo.FotosMascota WHERE mascotaId = ? AND posicion = ?",
                mascota_id, posicion,
            )
            if foto is not None:
                cursor.execute(
                    """INSERT INTO dbo.FotosMascota (mascotaId, posicion, tipo, contenido)
                       VALUES (?, ?, ?, ?)""",
                    mascota_id, posicion, foto.tipo, foto.contenido,
                )

    def add(self, datos: MascotaCreate, fotos: dict[int, FotoMascota]) -> Mascota:
        columnas = ", ".join(COLUMNAS)
        parametros = ", ".join("?" for _ in COLUMNAS)
        with conectar() as cursor:
            cursor.execute(
                f"INSERT INTO dbo.Mascotas ({columnas}) OUTPUT INSERTED.id VALUES ({parametros})",
                *valores_ficha(datos),
            )
            mascota_id = cursor.fetchone()[0]
            self._guardar_fotos(cursor, mascota_id, fotos)
            return self._consultar(cursor, mascota_id)[0]

    def update(
        self, mascota_id: int, datos: MascotaUpdate, cambios: dict[int, FotoMascota | None]
    ) -> Mascota | None:
        asignaciones = ", ".join(f"{columna} = ?" for columna in COLUMNAS)
        with conectar() as cursor:
            cursor.execute(
                f"UPDATE dbo.Mascotas SET {asignaciones} WHERE id = ?",
                *valores_ficha(datos), mascota_id,
            )
            if not cursor.rowcount:
                return None
            self._guardar_fotos(cursor, mascota_id, cambios)
            return self._consultar(cursor, mascota_id)[0]

    def delete(self, mascota_id: int) -> bool:
        with conectar() as cursor:
            cursor.execute("DELETE FROM dbo.Mascotas WHERE id = ?", mascota_id)
            return cursor.rowcount > 0

    def get_foto(self, mascota_id: int, posicion: int) -> FotoMascota | None:
        with conectar() as cursor:
            cursor.execute(
                "SELECT contenido, tipo FROM dbo.FotosMascota WHERE mascotaId = ? AND posicion = ?",
                mascota_id, posicion,
            )
            fila = cursor.fetchone()
            return FotoMascota(*fila) if fila else None


mascota_repository = MascotaRepository()
