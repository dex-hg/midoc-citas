from flask import Blueprint, jsonify

recepcion_bp = Blueprint("recepcion", __name__, url_prefix="/api/recepcion")

@recepcion_bp.get("/health")
def health():
    return jsonify({"modulo": "recepcion", "status": "ok"}), 200
