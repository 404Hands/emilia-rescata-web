from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse


from backend.apis.mascotas import router as mascotas_router
from backend.apis.recursos import router as recursos_router
from backend.services.exceptions import FotoNotFoundError, MascotaNotFoundError

from fastapi.middleware.cors import CORSMiddleware
from .apis.contacto_api import rutasContacto
from .apis.donacion_api import rutasDonacion

from .apis.solicitud_api import rutasSolicitud

from .apis.inicio_sesion_api import rutasInicioSesion

app = FastAPI(
    title="Emilia Rescata API",
    version="0.1.0",
    description="Administración de las mascotas y los recursos del refugio Emilia Rescata.",
    openapi_tags=[

        {
            "name": "Inicio de sesión",
            "description": "Verifica las credenciales del personal autorizado.",
        },

        {
            "name": "Solicitudes",
            "description": "Recibe las solicitudes de adopción.",
        },
        {
            "name": "Mascotas",
            "description": "Registra mascotas en adopción y administra sus fichas.",
        },
        {
            "name": "Estado de la API",
            "description": "Comprueba que el servidor está disponible.",
        },
        {
            "name": "Comida y Recursos",
            "description": "Consulta el inventario y administra los ingresos y consumos.",
        },
    ],
    swagger_ui_parameters={
        "docExpansion": "list",
        "defaultModelsExpandDepth": -1,
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:4200'],
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(rutasDonacion, prefix='/api')
app.include_router(mascotas_router)
app.include_router(recursos_router)
app.include_router(rutasContacto, prefix='/api')
app.include_router(rutasSolicitud, prefix='/api')
app.include_router(rutasInicioSesion, prefix='/api')


@app.get(
    "/",
    tags=["Estado de la API"],
    summary="Comprobar el estado del servidor",
)
def inicio() -> dict[str, str]:
    return {"mensaje": "La API de Emilia Rescata está funcionando."}


@app.exception_handler(MascotaNotFoundError)
@app.exception_handler(FotoNotFoundError)
async def not_found_handler(
    request: Request,
    exc: MascotaNotFoundError | FotoNotFoundError,
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": str(exc)},
    )
