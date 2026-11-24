from io import BytesIO
from typing import Annotated, TypeAlias

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Path,
    Response,
    UploadFile,
    status,
)
from PIL import Image
from pydantic import ValidationError, WithJsonSchema

from backend.repositories.mascotas import FotoMascota
from backend.schemas.mascotas import Mascota, MascotaCreate, MascotaUpdate
from backend.services.mascotas import MascotaService, mascota_service


router = APIRouter(prefix="/mascotas", tags=["Mascotas"])

MAX_FOTO_BYTES = 5 * 1024 * 1024
TIPOS_IMAGEN = {
    "JPEG": "image/jpeg",
    "PNG": "image/png",
    "WEBP": "image/webp",
}


def get_mascota_service() -> MascotaService:
    return mascota_service


ServiceDep: TypeAlias = Annotated[MascotaService, Depends(get_mascota_service)]
MascotaId: TypeAlias = Annotated[int, Path(gt=0)]


# Swagger muestra un editor de objeto para la parte JSON del formulario.
# El navegador envía esa parte como texto junto con los archivos.
ejemplo_ficha = MascotaCreate(nombre="Roco", raza="Mestizo", edad=3).model_dump()
FichaJSON: TypeAlias = Annotated[
    str,
    WithJsonSchema({"type": "object", "example": ejemplo_ficha}),
]


def leer_foto(archivo: UploadFile, campo: str) -> FotoMascota:
    """Comprueba el tamaño y el formato de la imagen antes de guardarla."""
    contenido = archivo.file.read(MAX_FOTO_BYTES + 1)

    if len(contenido) > MAX_FOTO_BYTES:
        raise HTTPException(413, detail=f"{campo}: la foto supera los 5 MiB.")

    try:
        with Image.open(BytesIO(contenido)) as imagen:
            tipo = TIPOS_IMAGEN.get(imagen.format or "")
            imagen.verify()
    except (OSError, SyntaxError, ValueError, Image.DecompressionBombError) as error:
        raise HTTPException(
            422, detail=f"{campo}: selecciona una imagen válida."
        ) from error

    if tipo is None:
        raise HTTPException(422, detail=f"{campo}: usa JPG, PNG o WebP.")

    return FotoMascota(contenido=contenido, tipo=tipo)


@router.get("", response_model=list[Mascota], summary="Listar mascotas")
def listar_mascotas(service: ServiceDep) -> list[Mascota]:
    return service.listar()


@router.get("/{mascota_id}", response_model=Mascota, summary="Obtener ficha")
def obtener_mascota(mascota_id: MascotaId, service: ServiceDep) -> Mascota:
    return service.obtener(mascota_id)


@router.post(
    "",
    response_model=Mascota,
    status_code=status.HTTP_201_CREATED,
    summary="Registrar mascota con sus fotos",
)
def crear_mascota(
    service: ServiceDep,
    datos: Annotated[FichaJSON, Form(description="Ficha de la mascota en formato JSON")],
    foto_principal: Annotated[UploadFile, File()],
    foto_extra_1: Annotated[UploadFile | None, File()] = None,
    foto_extra_2: Annotated[UploadFile | None, File()] = None,
    foto_extra_3: Annotated[UploadFile | None, File()] = None,
) -> Mascota:
    try:
        ficha = MascotaCreate.model_validate_json(datos)
    except ValidationError as error:
        errores = error.errors(include_input=False, include_context=False)
        raise HTTPException(422, detail=errores) from error

    fotos = {0: leer_foto(foto_principal, "Foto principal")}

    for posicion, archivo in enumerate(
        (foto_extra_1, foto_extra_2, foto_extra_3), start=1
    ):
        if archivo is not None:
            fotos[posicion] = leer_foto(archivo, f"Foto adicional {posicion}")

    return service.crear(ficha, fotos)


@router.put(
    "/{mascota_id}",
    response_model=Mascota,
    summary="Editar la ficha y sus fotos",
)
def actualizar_mascota(
    mascota_id: MascotaId,
    service: ServiceDep,
    datos: Annotated[FichaJSON, Form(description="Ficha completa en formato JSON")],
    foto_principal: Annotated[UploadFile | None, File()] = None,
    foto_extra_1: Annotated[UploadFile | None, File()] = None,
    foto_extra_2: Annotated[UploadFile | None, File()] = None,
    foto_extra_3: Annotated[UploadFile | None, File()] = None,
    quitar_extra_1: Annotated[bool, Form()] = False,
    quitar_extra_2: Annotated[bool, Form()] = False,
    quitar_extra_3: Annotated[bool, Form()] = False,
) -> Mascota:
    try:
        ficha = MascotaUpdate.model_validate_json(datos)
    except ValidationError as error:
        errores = error.errors(include_input=False, include_context=False)
        raise HTTPException(422, detail=errores) from error

    cambios: dict[int, FotoMascota | None] = {}
    archivos = (foto_principal, foto_extra_1, foto_extra_2, foto_extra_3)


    quitar = (False, quitar_extra_1, quitar_extra_2, quitar_extra_3)

    for posicion, archivo in enumerate(archivos):
        if quitar[posicion] and archivo is not None:
            raise HTTPException(
                422,
                detail=f"Elige quitar o reemplazar la foto {posicion}.",
            )

        if quitar[posicion]:
            cambios[posicion] = None
        elif archivo is not None:
            cambios[posicion] = leer_foto(archivo, f"Foto {posicion}")

    return service.actualizar(mascota_id, ficha, cambios)


@router.delete(
    "/{mascota_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar mascota y sus fotos",
)
def eliminar_mascota(mascota_id: MascotaId, service: ServiceDep) -> Response:
    service.eliminar(mascota_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{mascota_id}/fotos/{posicion}",
    summary="Ver una foto de la mascota",
    description="La posición 0 es la principal. Las posiciones 1, 2 y 3 son las adicionales.",
    response_class=Response,
    responses={
        200: {
            "content": {
                tipo: {"schema": {"type": "string", "format": "binary"}}
                for tipo in TIPOS_IMAGEN.values()
            }
        }
    },
)
def ver_foto(
    mascota_id: MascotaId,
    posicion: Annotated[int, Path(ge=0, le=3)],
    service: ServiceDep,
) -> Response:
    foto = service.obtener_foto(mascota_id, posicion)
    return Response(content=foto.contenido, media_type=foto.tipo)
