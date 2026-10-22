from flask import Blueprint, jsonify

promotor_bp = Blueprint("promotor", __name__, url_prefix="/api/promotor")

@promotor_bp.get("/health")
def health():
    return jsonify({"modulo": "promotor", "status": "ok"}), 200
