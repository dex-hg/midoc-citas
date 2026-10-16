"""Lectura y validación de la configuración externa."""

import os
from collections.abc import Mapping
from pathlib import Path
from urllib.parse import urlsplit

from dotenv import load_dotenv


def cargar_configuracion() -> dict[str, object]:
    """Cargar server/.env sin reemplazar las variables del proceso."""
    ruta_entorno = Path(__file__).resolve().parents[1] / ".env"
    load_dotenv(ruta_entorno, override=False)

    return {
        "MIDOC_MODO": os.getenv("MIDOC_MODO", "local").strip().lower(),
        "SUPABASE_URL": os.getenv("SUPABASE_URL", "").strip(),
        "SUPABASE_PUBLISHABLE_KEY": os.getenv("SUPABASE_PUBLISHABLE_KEY", "").strip(),
        "DEBUG": False,
        "TESTING": False,
        "MAX_CONTENT_LENGTH": 1024 * 1024,
        "SESSION_COOKIE_HTTPONLY": True,
        "SESSION_COOKIE_SAMESITE": "Lax",
    }


def validar_configuracion(configuracion: Mapping[str, object]) -> None:
    """Rechazar modos desconocidos y valores incompletos antes del arranque."""
    modo = configuracion["MIDOC_MODO"]
    if modo not in {"local", "supabase"}:
        raise ValueError("MIDOC_MODO debe ser local o supabase.")

    if modo == "local":
        return

    direccion = configuracion["SUPABASE_URL"]
    clave_publica = configuracion["SUPABASE_PUBLISHABLE_KEY"]
    if not isinstance(direccion, str) or not direccion:
        raise ValueError("Completa SUPABASE_URL para usar el modo supabase.")
    if not isinstance(clave_publica, str) or not clave_publica:
        raise ValueError("Completa SUPABASE_PUBLISHABLE_KEY para usar el modo supabase.")

    try:
        partes = urlsplit(direccion)
        puerto = partes.port
        es_local = partes.hostname in {"localhost", "127.0.0.1", "::1"}
        protocolo_valido = partes.scheme == "https" or (partes.scheme == "http" and es_local)
        direccion_valida = (
            protocolo_valido
            and partes.hostname
            and partes.path in {"", "/"}
            and not partes.username
            and not partes.password
            and not partes.query
            and not partes.fragment
            and (puerto is None or 1 <= puerto <= 65535)
        )
    except ValueError:
        direccion_valida = False

    if not direccion_valida:
        raise ValueError("SUPABASE_URL debe usar HTTPS (o HTTP local), sin ruta ni credenciales.")

    prefijo_publico = "sb_publishable_"
    if not clave_publica.startswith(prefijo_publico) or len(clave_publica) <= len(prefijo_publico):
        raise ValueError("Usa una clave publicable sb_publishable_ de Supabase.")
