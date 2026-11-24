import os
from contextlib import contextmanager
from pathlib import Path

import pyodbc
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


@contextmanager
def conectar():
    servidor = os.getenv("SQL_SERVER", "localhost")
    base = os.getenv("SQL_DATABASE", "EmiliaRescataWeb")
    driver = os.getenv("SQL_DRIVER", "ODBC Driver 18 for SQL Server")
    confiar = os.getenv("SQL_TRUST_SERVER_CERTIFICATE", "no")
    conexion = pyodbc.connect(
        f"DRIVER={{{driver}}};SERVER={servidor};DATABASE={base};"
        f"Trusted_Connection=yes;Encrypt=yes;TrustServerCertificate={confiar};",
        timeout=5,
    )
    try:
        yield conexion.cursor()
        conexion.commit()
    except Exception:
        conexion.rollback()
        raise
    finally:
        conexion.close()


def filas(cursor):
    columnas = [columna[0] for columna in cursor.description]
    return [dict(zip(columnas, fila)) for fila in cursor.fetchall()]
