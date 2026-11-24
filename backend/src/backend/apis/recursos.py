from typing import Annotated

from fastapi import APIRouter, HTTPException, Path, Response, status

from backend.repositories.recursos import (
    IngresoNoEncontradoError,
    SaldoFueraDeRangoError,
    StockInsuficienteError,
)
from backend.schemas.recursos import Ingreso, IngresoDatos, Producto, ProductoConIngreso, ProductoId
from backend.services.recursos import IngresoInvalidoError, recurso_service


router = APIRouter(prefix="/recursos", tags=["Comida y Recursos"])
IngresoId = Annotated[int, Path(gt=0)]


@router.get("", response_model=list[Producto], summary="Consultar inventario")
def listar_recursos(solo_faltantes: bool = False) -> list[Producto]:
    return recurso_service.listar(solo_faltantes)


@router.post(
    "/ingresos",
    response_model=ProductoConIngreso,
    summary="Registrar llegada de comida o recursos",
)
def registrar_ingreso(datos: IngresoDatos) -> ProductoConIngreso:
    try:
        return recurso_service.registrar_ingreso(datos.productoId, datos.cantidad, datos.unidad)
    except (IngresoInvalidoError, SaldoFueraDeRangoError) as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc


@router.post(
    "/{producto_id}/consumos",
    response_model=Producto,
    summary="Usar un saco, una lata o un bidón",
)
def registrar_consumo(producto_id: ProductoId) -> Producto:
    try:
        return recurso_service.usar_uno(producto_id)
    except StockInsuficienteError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

@router.get("/ingresos", response_model=list[Ingreso], summary="Consultar ingresos")
def listar_ingresos() -> list[Ingreso]:
    return recurso_service.listar_ingresos()


@router.put("/ingresos/{ingreso_id}", response_model=Ingreso, summary="Editar un ingreso")
def editar_ingreso(ingreso_id: IngresoId, datos: IngresoDatos) -> Ingreso:
    try:
        return recurso_service.editar_ingreso(ingreso_id, datos.productoId, datos.cantidad, datos.unidad)
    except IngresoNoEncontradoError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except StockInsuficienteError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    except (IngresoInvalidoError, SaldoFueraDeRangoError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.delete("/ingresos/{ingreso_id}", status_code=204, summary="Eliminar un ingreso")
def eliminar_ingreso(ingreso_id: IngresoId) -> Response:
    try:
        recurso_service.eliminar_ingreso(ingreso_id)
    except IngresoNoEncontradoError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except StockInsuficienteError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    return Response(status_code=204)
