from fractions import Fraction
from uuid import UUID
from threading import Lock

from backend.schemas.recursos import Ingreso, Producto, ProductoConIngreso, ProductoId


class StockInsuficienteError(Exception):
    """La cantidad disponible es menor que la solicitada."""


class IngresoNoEncontradoError(Exception):
    """El ingreso solicitado no existe."""


class SaldoFueraDeRangoError(Exception):
    """El saldo supera el rango numérico del inventario."""


class RecursoRepository:
    def __init__(self) -> None:
        self._lock = Lock()
        self._ingresos: dict[UUID, Ingreso] = {}

        productos = [
            Producto(
                id="adultos",
                nombre="Comida Perros Adultos",
                cantidad=12,
                unidad="saco",
                plural="sacos",
                kgPorUnidad=20,
                minimo=3,
                detalle="Alimento para perros adultos",
            ),
            Producto(
                id="cachorros",
                nombre="Comida Cachorros (Puppy)",
                cantidad=3,
                unidad="saco",
                plural="sacos",
                kgPorUnidad=20,
                minimo=3,
                detalle="Alimento para cachorros",
            ),
            Producto(
                id="especial",
                nombre="Comida Especial / Hipoalergénica",
                cantidad=5,
                unidad="saco",
                plural="sacos",
                kgPorUnidad=24,
                minimo=2,
                detalle="Para perritos con dieta delicada",
            ),
            Producto(
                id="latas",
                nombre="Latas de Comida Húmeda / Paté",
                cantidad=48,
                unidad="lata",
                plural="latas",
                minimo=10,
                detalle="Para premios y medicamentos",
            ),
            Producto(
                id="desinfectante",
                nombre="Desinfectante de Caniles",
                cantidad=2,
                unidad="bidón",
                plural="bidones",
                minimo=2,
                detalle="Para el lavado de patios",
            ),
        ]

        self._productos = {producto.id: producto for producto in productos}

        self._saldos = {p.id: Fraction(str(p.cantidad)) for p in productos}

    def listar(self) -> list[Producto]:
        with self._lock:
            return list(self._productos.values())

    def obtener(self, producto_id: ProductoId) -> Producto:
        with self._lock:
            return self._productos[producto_id]

    def listar_ingresos(self) -> list[Ingreso]:
        with self._lock:
            return list(self._ingresos.values())

    def _envases(self, ingreso: Ingreso) -> Fraction:
        cantidad = Fraction(str(ingreso.cantidad))
        if ingreso.unidad == "kg":
            peso = self._productos[ingreso.productoId].kgPorUnidad
            if peso is None:
                raise ValueError("Este producto se registra por envase.")
            return cantidad / Fraction(str(peso))
        return cantidad

    def _aplicar(self, cambios: dict[ProductoId, Fraction]) -> None:
        # Validar todos los saldos antes de modificar cualquiera de ellos.
        saldos = {}
        productos = {}
        for clave, cambio in cambios.items():
            saldo = self._saldos[clave] + cambio
            if saldo < 0:
                raise StockInsuficienteError(
                    f"Stock insuficiente de {self._productos[clave].nombre}."
                )
            try:
                cantidad = float(saldo)
            except OverflowError as exc:
                raise SaldoFueraDeRangoError(
                    f"El saldo de {self._productos[clave].nombre} supera el máximo admitido."
                ) from exc
            saldos[clave] = saldo
            productos[clave] = self._productos[clave].model_copy(
                update={"cantidad": cantidad}
            )
        self._saldos.update(saldos)
        self._productos.update(productos)

    def usar_uno(self, clave: ProductoId) -> Producto:
        with self._lock:
            self._aplicar({clave: Fraction(-1)})
            return self._productos[clave]

    def crear_ingreso(self, ingreso: Ingreso) -> ProductoConIngreso:
        with self._lock:
            self._aplicar({ingreso.productoId: self._envases(ingreso)})
            self._ingresos[ingreso.ingreso_id] = ingreso
            producto = self._productos[ingreso.productoId]
            return ProductoConIngreso(**producto.model_dump(), ingreso_id=ingreso.ingreso_id)

    def _buscar_ingreso(self, ingreso_id: UUID) -> Ingreso:
        anterior = self._ingresos.get(ingreso_id)
        if anterior is None:
            raise IngresoNoEncontradoError("El ingreso solicitado no existe.")
        return anterior

    def editar_ingreso(self, nuevo: Ingreso) -> Ingreso:
        with self._lock:
            anterior = self._buscar_ingreso(nuevo.ingreso_id)
            cambios = {anterior.productoId: -self._envases(anterior)}
            cambios[nuevo.productoId] = cambios.get(nuevo.productoId, Fraction(0)) + self._envases(nuevo)
            self._aplicar(cambios)
            self._ingresos[nuevo.ingreso_id] = nuevo
            return nuevo

    def eliminar_ingreso(self, ingreso_id: UUID) -> None:
        with self._lock:
            anterior = self._buscar_ingreso(ingreso_id)
            self._aplicar({anterior.productoId: -self._envases(anterior)})
            del self._ingresos[ingreso_id]


recurso_repository = RecursoRepository()
