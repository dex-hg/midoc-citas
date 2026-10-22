from flask import Blueprint, jsonify

cliente_bp = Blueprint("cliente", __name__, url_prefix="/api/clientes")

@cliente_bp.get("/health")
def health():
    return jsonify({"modulo": "clientes", "status": "ok"}), 200
