from ..database import conectar, filas
from ..schemas.solicitud_schema import Solicitud


class SolicitudRepositorio:
    def guardarSolicitud(self, nuevo: Solicitud):
        datos = nuevo.model_dump(exclude={"id"})
        with conectar() as cursor:
            cursor.execute(
                """INSERT INTO dbo.Solicitudes
                   (nombre, celular, distrito, tipoVivienda, propiedadVivienda, hayNinos, otrasMascotas, motivo, tiempoDisponible, compromiso)
                   OUTPUT INSERTED.id
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                *datos.values(),
            )
            return Solicitud(id=cursor.fetchone()[0], **datos)

    def mostrarSolicitudes(self):
        with conectar() as cursor:
            cursor.execute("SELECT * FROM dbo.Solicitudes ORDER BY id")
            return [Solicitud(**fila) for fila in filas(cursor)]

    def eliminarSolicitud(self, id: int):
        with conectar() as cursor:
            cursor.execute("DELETE FROM dbo.Solicitudes WHERE id = ?", id)
            return id if cursor.rowcount else None
