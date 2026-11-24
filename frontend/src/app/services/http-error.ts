import { HttpErrorResponse } from '@angular/common/http';

interface ErrorValidacion {
  loc?: (string | number)[];
  msg?: string;
}

/**
 * Obtiene un mensaje legible a partir de las respuestas de error de FastAPI.
 * Los errores de validación llegan como `{ detail: [{ loc, msg }] }`.
 */
export function mensajeDeError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }

  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
  }

  if (typeof error.error === 'string' && error.error) {
    return error.error;
  }

  const detalle = error.error?.detail;

  if (typeof detalle === 'string') {
    return detalle;
  }

  if (Array.isArray(detalle)) {
    const mensajes = (detalle as ErrorValidacion[])
      .map(item => {
        const campo = item.loc
          ?.filter(parte => parte !== 'body')
          .join('.');

        return campo && item.msg ? `${campo}: ${item.msg}` : item.msg;
      })
      .filter((mensaje): mensaje is string => Boolean(mensaje));

    if (mensajes.length > 0) {
      return mensajes.join(' ');
    }
  }

  return 'El servidor rechazó la solicitud. Inténtalo de nuevo.';
}
