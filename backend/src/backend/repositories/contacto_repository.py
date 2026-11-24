from ..database import conectar, filas
from ..schemas.contacto_schema import Contacto


class ContactoRepositorio:
    def guardarContacto(self, nuevo: Contacto):
        datos = nuevo.model_dump(exclude={"id"})
        with conectar() as cursor:
            cursor.execute(
                """INSERT INTO dbo.Contactos
                   (nombre, ciudad, correo, telefono, mensaje)
                   OUTPUT INSERTED.id
                   VALUES (?, ?, ?, ?, ?)""",
                *datos.values(),
            )
            return Contacto(id=cursor.fetchone()[0], **datos)

    def mostrarContactos(self):
        with conectar() as cursor:
            cursor.execute("SELECT * FROM dbo.Contactos ORDER BY id")
            return [Contacto(**fila) for fila in filas(cursor)]

    def eliminarContacto(self, id: int):
        with conectar() as cursor:
            cursor.execute("DELETE FROM dbo.Contactos WHERE id = ?", id)
            return id if cursor.rowcount else None
