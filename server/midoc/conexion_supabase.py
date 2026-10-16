"""Inicialización del SDK de Supabase, sin ejecutar consultas remotas."""

from flask import Flask
from supabase import create_client
from supabase.client import ClientOptions


def inicializar_supabase(aplicacion: Flask) -> None:
    """Preparar un cliente sin sesión de usuario cuando se activa Supabase."""
    aplicacion.extensions["supabase"] = None
    if aplicacion.config["MIDOC_MODO"] == "local":
        return

    aplicacion.extensions["supabase"] = create_client(
        aplicacion.config["SUPABASE_URL"],
        aplicacion.config["SUPABASE_PUBLISHABLE_KEY"],
        options=ClientOptions(
            auto_refresh_token=False,
            persist_session=False,
            postgrest_client_timeout=10,
            storage_client_timeout=10,
        ),
    )
