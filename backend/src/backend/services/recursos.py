from math import isfinite

from backend.repositories.recursos import RecursoRepository, recurso_repository
from backend.schemas.recursos import Ingreso, IngresoDatos, Producto, ProductoConIngreso, ProductoId, UnidadIngreso


class IngresoInvalidoError(ValueError):
    """La cantidad o la unidad no es válida para el producto."""


class RecursoService:
    def __init__(self, repository: RecursoRepository) -> None:
        self._repository = repository

    def listar(self, solo_faltantes: bool = False) -> list[Producto]:
        productos = self._repository.listar()

        if solo_faltantes:
            return [p for p in productos if p.cantidad <= p.minimo]

        return productos

    def _validar_ingreso(
        self,
        producto_id: ProductoId,
        cantidad: float,
        unidad: UnidadIngreso,
    ) -> None:
        producto = self._repository.obtener(producto_id)

        if not isfinite(cantidad) or cantidad <= 0:
            raise IngresoInvalidoError("Ingresa una cantidad mayor que cero.")

        if unidad == "kg":
            if producto.kgPorUnidad is None:
                raise IngresoInvalidoError(
                    f"Este producto se registra en {producto.plural}."
                )
        else:
            if not float(cantidad).is_integer():
                raise IngresoInvalidoError(
                    f"Ingresa un número entero de {producto.plural}."
                )

    def registrar_ingreso(self, producto_id: ProductoId, cantidad: float, unidad: UnidadIngreso) -> ProductoConIngreso:
        self._validar_ingreso(producto_id, cantidad, unidad)
        ingreso = IngresoDatos(productoId=producto_id, cantidad=cantidad, unidad=unidad)
        return self._repository.crear_ingreso(ingreso)

    def listar_ingresos(self) -> list[Ingreso]:
        return self._repository.listar_ingresos()

    def editar_ingreso(self, ingreso_id: int, producto_id: ProductoId, cantidad: float, unidad: UnidadIngreso) -> Ingreso:
        self._validar_ingreso(producto_id, cantidad, unidad)
        ingreso = Ingreso(ingreso_id=ingreso_id, productoId=producto_id, cantidad=cantidad, unidad=unidad)
        return self._repository.editar_ingreso(ingreso)

    def eliminar_ingreso(self, ingreso_id: int) -> None:
        self._repository.eliminar_ingreso(ingreso_id)

    def usar_uno(self, producto_id: ProductoId) -> Producto:
        return self._repository.usar_uno(producto_id)


recurso_service = RecursoService(recurso_repository)
