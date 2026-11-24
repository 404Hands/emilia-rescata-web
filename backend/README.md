# Emilia Rescata API

Desde el directorio del backend, ejecuta `uv sync` y luego `uv run backend`.
El servidor escucha en `http://127.0.0.1:8000` de forma predeterminada.
Define `BACKEND_PORT` para usar otro puerto.

- `/` comprueba el estado de la API.
- `/docs` abre la documentación interactiva.
- `/openapi.json` devuelve el esquema OpenAPI.

Los datos se guardan en memoria y se reinician al detener el servidor.
