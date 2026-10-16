"""Comprobación pública del proceso web."""

from flask import Blueprint, Response, jsonify

rutas_estado = Blueprint("estado", __name__, url_prefix="/api")


@rutas_estado.get("/estado")
def consultar_estado() -> Response:
    """Informar el arranque de Flask, sin afirmar conectividad con Supabase."""
    return jsonify(status="UP")
