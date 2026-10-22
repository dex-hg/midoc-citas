from flask import Blueprint, jsonify

administrador_bp = Blueprint(
    "administrador",
    __name__,
    url_prefix="/api/admin"
)

@administrador_bp.get("/health")
def health():
    return jsonify({"modulo": "administrador", "status": "ok"}), 200
