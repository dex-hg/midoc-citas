"""Fábrica de la aplicación Flask de MiDoc."""

from collections.abc import Mapping

from flask import Flask

from midoc.conexion_supabase import inicializar_supabase
from midoc.configuracion import cargar_configuracion, validar_configuracion
from midoc.errores import registrar_errores
from midoc.estado import rutas_estado


def crear_aplicacion(ajustes: Mapping[str, object] | None = None) -> Flask:
    """Crear una instancia independiente, sin cargar módulos del negocio."""
    aplicacion = Flask(__name__, static_folder=None)
    aplicacion.config.from_mapping(cargar_configuracion())

    if ajustes is not None:
        aplicacion.config.update(ajustes)

    validar_configuracion(aplicacion.config)
    aplicacion.json.ensure_ascii = False
    aplicacion.json.sort_keys = False

    inicializar_supabase(aplicacion)
    aplicacion.register_blueprint(rutas_estado)
    registrar_errores(aplicacion)
    return aplicacion
