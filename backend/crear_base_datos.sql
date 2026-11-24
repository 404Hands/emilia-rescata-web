USE master;
GO

IF DB_ID(N'EmiliaRescataWeb') IS NULL
    CREATE DATABASE EmiliaRescataWeb;
GO

USE EmiliaRescataWeb;
GO

IF DB_NAME() <> N'EmiliaRescataWeb'
    THROW 50001, 'No se pudo seleccionar la base EmiliaRescataWeb.', 1;

SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF OBJECT_ID(N'dbo.Usuarios', N'U') IS NULL
CREATE TABLE dbo.Usuarios (
    id int IDENTITY PRIMARY KEY,
    nombre nvarchar(max) NOT NULL,
    correo nvarchar(320) NOT NULL,
    correoNormalizado nvarchar(320) COLLATE Latin1_General_100_BIN2 NOT NULL UNIQUE,
    claveHash varchar(255) NOT NULL,
    rol nvarchar(30) NOT NULL
);

IF OBJECT_ID(N'dbo.Sesiones', N'U') IS NULL
CREATE TABLE dbo.Sesiones (
    id char(64) PRIMARY KEY,
    usuarioId int NOT NULL REFERENCES dbo.Usuarios(id) ON DELETE CASCADE,
    vence datetime2 NOT NULL
);

IF OBJECT_ID(N'dbo.Mascotas', N'U') IS NULL
CREATE TABLE dbo.Mascotas (
    id int IDENTITY PRIMARY KEY,
    nombre nvarchar(max) NOT NULL,
    raza nvarchar(max) NOT NULL,
    especie nvarchar(50) NOT NULL DEFAULT N'Perro',
    edad bigint NOT NULL CHECK (edad >= 0),
    sexo varchar(6) NOT NULL,
    tamano varchar(7) NOT NULL,
    historia nvarchar(max) NOT NULL,
    vacunado bit NOT NULL,
    desparasitado bit NOT NULL,
    esterilizado bit NOT NULL,
    amigable bit NOT NULL,
    jugueton bit NOT NULL,
    timido bit NOT NULL,
    carinoso bit NOT NULL,
    protector bit NOT NULL,
    obediente bit NOT NULL,
    tranquilo bit NOT NULL,
    inteligente bit NOT NULL
);

IF OBJECT_ID(N'dbo.FotosMascota', N'U') IS NULL
CREATE TABLE dbo.FotosMascota (
    mascotaId int NOT NULL REFERENCES dbo.Mascotas(id) ON DELETE CASCADE,
    posicion tinyint NOT NULL CHECK (posicion BETWEEN 0 AND 3),
    tipo varchar(16) NOT NULL,
    contenido varbinary(max) NOT NULL,
    PRIMARY KEY (mascotaId, posicion)
);

IF OBJECT_ID(N'dbo.Productos', N'U') IS NULL
CREATE TABLE dbo.Productos (
    id varchar(16) PRIMARY KEY,
    orden tinyint NOT NULL,
    nombre nvarchar(100) NOT NULL,
    cantidadInicial int NOT NULL,
    unidad nvarchar(20) NOT NULL,
    plural nvarchar(20) NOT NULL,
    kgPorUnidad float NULL,
    minimo int NOT NULL,
    detalle nvarchar(200) NOT NULL,
    consumos bigint NOT NULL DEFAULT 0
);

IF OBJECT_ID(N'dbo.Ingresos', N'U') IS NULL
CREATE TABLE dbo.Ingresos (
    ingreso_id int IDENTITY PRIMARY KEY,
    productoId varchar(16) NOT NULL REFERENCES dbo.Productos(id),
    cantidad float NOT NULL CHECK (cantidad > 0),
    unidad varchar(6) NOT NULL CHECK (unidad IN ('envase', 'kg'))
);

IF OBJECT_ID(N'dbo.Contactos', N'U') IS NULL
CREATE TABLE dbo.Contactos (
    id int IDENTITY PRIMARY KEY,
    nombre nvarchar(max) NOT NULL,
    ciudad nvarchar(max) NOT NULL,
    correo nvarchar(320) NOT NULL,
    telefono nvarchar(max) NOT NULL,
    mensaje nvarchar(max) NOT NULL
);

IF OBJECT_ID(N'dbo.Solicitudes', N'U') IS NULL
CREATE TABLE dbo.Solicitudes (
    id int IDENTITY PRIMARY KEY,
    nombre nvarchar(max) NOT NULL,
    celular nvarchar(18) NOT NULL,
    distrito nvarchar(max) NOT NULL,
    tipoVivienda nvarchar(max) NOT NULL,
    propiedadVivienda nvarchar(max) NOT NULL,
    hayNinos nvarchar(max) NOT NULL,
    otrasMascotas nvarchar(max) NOT NULL,
    motivo nvarchar(max) NOT NULL,
    tiempoDisponible nvarchar(max) NOT NULL,
    compromiso bit NOT NULL CHECK (compromiso = 1)
);

IF OBJECT_ID(N'dbo.Donaciones', N'U') IS NULL
CREATE TABLE dbo.Donaciones (
    id int IDENTITY PRIMARY KEY,
    monto float NOT NULL CHECK (monto > 0),
    metodoPago nvarchar(max) NOT NULL,
    nombre nvarchar(max) NOT NULL,
    apellidos nvarchar(max) NOT NULL,
    correo nvarchar(max) NOT NULL,
    telefono nvarchar(max) NOT NULL,
    direccion nvarchar(max) NOT NULL,
    ciudad nvarchar(max) NOT NULL,
    provincia nvarchar(max) NOT NULL,
    codigoPostal nvarchar(max) NOT NULL,
    fecha datetime2 NOT NULL,
    estado nvarchar(10) NOT NULL CHECK (estado IN (N'Pendiente', N'Confirmada', N'Rechazada'))
);

INSERT INTO dbo.Productos
    (id, orden, nombre, cantidadInicial, unidad, plural, kgPorUnidad, minimo, detalle)
SELECT datos.*
FROM (VALUES
    ('adultos', 1, N'Comida Perros Adultos', 12, N'saco', N'sacos', 20, 3, N'Alimento para perros adultos'),
    ('cachorros', 2, N'Comida Cachorros (Puppy)', 3, N'saco', N'sacos', 20, 3, N'Alimento para cachorros'),
    ('especial', 3, N'Comida Especial / Hipoalergénica', 5, N'saco', N'sacos', 24, 2, N'Para perritos con dieta delicada'),
    ('latas', 4, N'Latas de Comida Húmeda / Paté', 48, N'lata', N'latas', NULL, 10, N'Para premios y medicamentos'),
    ('desinfectante', 5, N'Desinfectante de Caniles', 2, N'bidón', N'bidones', NULL, 2, N'Para el lavado de patios')
) AS datos (id, orden, nombre, cantidadInicial, unidad, plural, kgPorUnidad, minimo, detalle)
WHERE NOT EXISTS (SELECT 1 FROM dbo.Productos WHERE id = datos.id);

COMMIT;
