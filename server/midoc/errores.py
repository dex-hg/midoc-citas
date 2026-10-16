"""Respuestas HTTP de error en JSON, sin detalles internos."""

from flask import Flask
from werkzeug.exceptions import HTTPException
from werkzeug.wrappers import Response


def registrar_errores(aplicacion: Flask) -> None:
    """Mantener los códigos y encabezados HTTP al convertir errores a JSON."""

    @aplicacion.errorhandler(HTTPException)
    def responder_error_http(error: HTTPException) -> Response:
        mensajes = {
            404: "La ruta solicitada no existe.",
            405: "El método solicitado no está permitido.",
            413: "La solicitud supera el tamaño permitido.",
            500: "No se pudo completar la solicitud.",
        }
        respuesta = error.get_response()
        respuesta.data = aplicacion.json.dumps(
            {
                "error": {
                    "codigo": error.code,
                    "mensaje": mensajes.get(error.code, "La solicitud no pudo completarse."),
                }
            }
        )
        respuesta.mimetype = "application/json"
        return respuesta
