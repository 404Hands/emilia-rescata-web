from fastapi import APIRouter, Depends, HTTPException, status
from .inicio_sesion_api import verificar_sesion
from ..services.contacto_services import ContactoServicio
from ..schemas.contacto_schema import Contacto

rutasContacto = APIRouter(prefix='/contactos', tags=['Contactos'])

ContactoServicio = ContactoServicio()

@rutasContacto.post('/')
def guardarContacto(contactoNuevo: Contacto):
    try:
        return ContactoServicio.guardarContacto(contactoNuevo)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@rutasContacto.get('/', dependencies=[Depends(verificar_sesion)])
def mostrarContactos():
    return ContactoServicio.mostrarContactos()

@rutasContacto.delete('/{id}', dependencies=[Depends(verificar_sesion)])
def eliminarContacto(id: int):
    try:
        return ContactoServicio.eliminarContacto(id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
