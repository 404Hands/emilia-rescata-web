from fractions import Fraction

from backend.database import conectar, filas
from backend.schemas.recursos import Ingreso, IngresoDatos, Producto, ProductoConIngreso, ProductoId


class StockInsuficienteError(Exception):
    """La cantidad disponible es menor que la solicitada."""


class IngresoNoEncontradoError(Exception):
    """El ingreso solicitado no existe."""


class SaldoFueraDeRangoError(Exception):
    """El saldo supera el rango numérico del inventario."""


class RecursoRepository:
    def _productos(self, cursor, escritura: bool = False) -> dict[ProductoId, Producto]:
        # Los cambios de stock y de ingresos usan el mismo bloqueo hasta el commit.
        bloqueo = "TABLOCKX, HOLDLOCK" if escritura else "TABLOCK, HOLDLOCK"
        cursor.execute(f"SELECT * FROM dbo.Productos WITH ({bloqueo}) ORDER BY orden")
        datos = filas(cursor)
        productos = {}
        saldos = {}
        for fila in datos:
            clave = fila["id"]
            saldos[clave] = Fraction(fila.pop("cantidadInicial") - fila.pop("consumos"))
            productos[clave] = fila

        for ingreso in self._ingresos(cursor):
            clave = ingreso.productoId
            cantidad = Fraction(str(ingreso.cantidad))
            if ingreso.unidad == "kg":
                cantidad /= Fraction(str(productos[clave]["kgPorUnidad"]))
            saldos[clave] += cantidad

        resultado = {}
        for clave, fila in productos.items():
            saldo = saldos[clave]
            if saldo < 0:
                raise StockInsuficienteError(f"Stock insuficiente de {fila['nombre']}.")
            try:
                cantidad = float(saldo)
            except OverflowError as exc:
                raise SaldoFueraDeRangoError(
                    f"El saldo de {fila['nombre']} supera el máximo admitido."
                ) from exc
            resultado[clave] = Producto(**fila, cantidad=cantidad)
        return resultado

    def _ingresos(self, cursor) -> list[Ingreso]:
        cursor.execute("SELECT * FROM dbo.Ingresos ORDER BY ingreso_id")
        return [Ingreso(**fila) for fila in filas(cursor)]

    def listar(self) -> list[Producto]:
        with conectar() as cursor:
            return list(self._productos(cursor).values())

    def obtener(self, producto_id: ProductoId) -> Producto:
        with conectar() as cursor:
            return self._productos(cursor)[producto_id]

    def listar_ingresos(self) -> list[Ingreso]:
        with conectar() as cursor:
            return self._ingresos(cursor)

    def usar_uno(self, clave: ProductoId) -> Producto:
        with conectar() as cursor:
            self._productos(cursor, escritura=True)
            cursor.execute("UPDATE dbo.Productos SET consumos = consumos + 1 WHERE id = ?", clave)
            return self._productos(cursor)[clave]

    def crear_ingreso(self, datos: IngresoDatos) -> ProductoConIngreso:
        with conectar() as cursor:
            self._productos(cursor, escritura=True)
            cursor.execute(
                """INSERT INTO dbo.Ingresos (productoId, cantidad, unidad)
                   OUTPUT INSERTED.ingreso_id VALUES (?, ?, ?)""",
                datos.productoId, datos.cantidad, datos.unidad,
            )
            ingreso_id = cursor.fetchone()[0]
            producto = self._productos(cursor)[datos.productoId]
            return ProductoConIngreso(**producto.model_dump(), ingreso_id=ingreso_id)

    def editar_ingreso(self, nuevo: Ingreso) -> Ingreso:
        with conectar() as cursor:
            self._productos(cursor, escritura=True)
            cursor.execute(
                "UPDATE dbo.Ingresos SET productoId = ?, cantidad = ?, unidad = ? WHERE ingreso_id = ?",
                nuevo.productoId, nuevo.cantidad, nuevo.unidad, nuevo.ingreso_id,
            )
            if not cursor.rowcount:
                raise IngresoNoEncontradoError("El ingreso solicitado no existe.")
            self._productos(cursor)
            return nuevo

    def eliminar_ingreso(self, ingreso_id: int) -> None:
        with conectar() as cursor:
            self._productos(cursor, escritura=True)
            cursor.execute("DELETE FROM dbo.Ingresos WHERE ingreso_id = ?", ingreso_id)
            if not cursor.rowcount:
                raise IngresoNoEncontradoError("El ingreso solicitado no existe.")
            self._productos(cursor)


recurso_repository = RecursoRepository()
