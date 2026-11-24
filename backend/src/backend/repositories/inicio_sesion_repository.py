import pyodbc

from ..database import conectar, filas
from ..schemas.inicio_sesion_schema import Usuario


class InicioSesionRepositorio:
    def guardarUsuario(self, usuario: Usuario):
        try:
            with conectar() as cursor:
                cursor.execute(
                    """INSERT INTO dbo.Usuarios (nombre, correo, correoNormalizado, claveHash, rol)
                       OUTPUT INSERTED.id VALUES (?, ?, ?, ?, ?)""",
                    usuario.nombre, usuario.correo, usuario.correo.lower(),
                    usuario.claveHash, usuario.rol,
                )
                return usuario.model_copy(update={"id": cursor.fetchone()[0]})
        except pyodbc.IntegrityError:
            if self.buscarPorCorreo(usuario.correo) is not None:
                return None
            raise

    def buscarPorCorreo(self, correo: str):
        with conectar() as cursor:
            cursor.execute(
                "SELECT id, nombre, correo, claveHash, rol FROM dbo.Usuarios WHERE correoNormalizado = ?",
                correo.lower(),
            )
            resultado = filas(cursor)
            return Usuario(**resultado[0]) if resultado else None

    def guardarSesion(self, sesion_id, usuario_id, vence):
        with conectar() as cursor:
            cursor.execute("DELETE FROM dbo.Sesiones WHERE vence <= SYSUTCDATETIME()")
            cursor.execute(
                "INSERT INTO dbo.Sesiones (id, usuarioId, vence) VALUES (?, ?, ?)",
                sesion_id, usuario_id, vence,
            )

    def sesionActiva(self, sesion_id, usuario_id):
        with conectar() as cursor:
            cursor.execute(
                "SELECT 1 FROM dbo.Sesiones WHERE id = ? AND usuarioId = ? AND vence > SYSUTCDATETIME()",
                sesion_id, usuario_id,
            )
            return cursor.fetchone() is not None

    def cerrarSesion(self, sesion_id, usuario_id):
        with conectar() as cursor:
            cursor.execute("DELETE FROM dbo.Sesiones WHERE id = ? AND usuarioId = ?", sesion_id, usuario_id)
