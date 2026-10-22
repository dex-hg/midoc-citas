from flask import Blueprint, jsonify

doctor_bp = Blueprint("doctor", __name__, url_prefix="/api/doctores")

@doctor_bp.get("/health")
def health():
    return jsonify({"modulo": "doctores", "status": "ok"}), 200
