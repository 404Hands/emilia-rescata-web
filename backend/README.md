# Emilia Rescata API

## Crear la base en SQL Server Management Studio

1. Abre SSMS y conéctate al motor con **Autenticación de Windows**. Usa `localhost` para la instancia local predeterminada o el nombre de tu instancia, por ejemplo `localhost\SQLEXPRESS`.
2. Abre [crear_base_datos.sql](crear_base_datos.sql) con **Archivo → Abrir → Archivo**.
3. Pulsa **Ejecutar** o **F5**. Actualiza **Bases de datos** y abre `EmiliaRescataWeb → Tablas`. El script crea las tablas y carga los cinco productos iniciales. Puedes ejecutarlo nuevamente sin duplicar esos productos.

La cuenta de Windows necesita permiso para crear la base y sus tablas. Las fotos dependen de su mascota, los ingresos de su producto y las sesiones de su usuario. El formulario actual de adopción admite solicitudes generales, por lo que estas se guardan sin asociarlas a una mascota.

## Iniciar FastAPI

Instala el **Microsoft ODBC Driver 18 for SQL Server**. Usa la misma instancia en `SQL_SERVER` de `backend/.env`. Si configuras otro equipo, copia `.env.example` a `.env` y genera un secreto propio. Desde el directorio `backend` en PowerShell:

```powershell
uv sync
uv run python -c "import secrets; print(secrets.token_hex(32))"
```

Pega el valor generado en `JWT_SECRET`. La conexión usa la cuenta de Windows que ejecuta FastAPI. El ejemplo confía en el certificado de la instancia local para desarrollo.

```powershell
uv run backend
```

La API escucha en `http://127.0.0.1:8000`. Puedes cambiar el puerto con `BACKEND_PORT`. Inicia Angular con `npm start` desde `frontend`.

- `/` comprueba el estado de la API.
- `/docs` abre la documentación interactiva.
- `/openapi.json` devuelve el esquema OpenAPI.

## Probar el flujo

1. Registra una cuenta en el frontend e inicia sesión. Las cuentas se crean con el rol `Usuario`. El panel conserva el flujo del proyecto, accesible a las cuentas que hayan iniciado sesión.
2. Publica una mascota en **Panel General** con su ficha y foto. Revisa la tarjeta en **Adopciones → Quiero adoptar**.
3. Usa **Cerrar sesión** en el panel. SQL Server elimina esa sesión y la API rechaza el JWT anterior.

En Swagger, registra una cuenta con `POST /api/inicio-sesion/registro` e inicia sesión con `POST /api/inicio-sesion/`. Copia el campo `token` a **Authorize** para probar las operaciones protegidas. Envía ese mismo JWT a `POST /api/inicio-sesion/salir` para revocarlo. La sesión dura una hora o siete días si eliges **Recordar**.
