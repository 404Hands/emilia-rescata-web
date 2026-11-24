from datetime import datetime

from ..database import conectar, filas
from ..schemas.donacion import Donacion, DonacionNueva, DonacionActualizar


class DonacionRepositorio:
    def guardarDonacion(self, nuevo: DonacionNueva):
        datos = nuevo.model_dump(exclude={"id"})
        datos.update(fecha=datetime.now(), estado="Pendiente")
        with conectar() as cursor:
            cursor.execute(
                """INSERT INTO dbo.Donaciones
                   (monto, metodoPago, nombre, apellidos, correo, telefono, direccion, ciudad, provincia, codigoPostal, fecha, estado)
                   OUTPUT INSERTED.id
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                *datos.values(),
            )
            return Donacion(id=cursor.fetchone()[0], **datos)

    def mostrarDonaciones(self):
        with conectar() as cursor:
            cursor.execute("SELECT * FROM dbo.Donaciones ORDER BY id")
            return [Donacion(**fila) for fila in filas(cursor)]

    def actualizarDonacion(self, id: int, datos: DonacionActualizar):
        with conectar() as cursor:
            cursor.execute(
                "UPDATE dbo.Donaciones SET estado = ? OUTPUT INSERTED.* WHERE id = ?",
                datos.estado, id,
            )
            resultado = filas(cursor)
            return Donacion(**resultado[0]) if resultado else None

    def eliminarDonacion(self, id: int):
        with conectar() as cursor:
            cursor.execute("DELETE FROM dbo.Donaciones WHERE id = ?", id)
            return id if cursor.rowcount else None
