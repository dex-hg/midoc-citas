from flask import Blueprint, jsonify, request

from app.services.auth_service import AuthService


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.get("/health")
def health():
    return jsonify({
        "modulo": "auth",
        "status": "ok"
    }), 200


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}

    dni = data.get("dni")
    password = data.get("password")

    resultado_dni = AuthService.validar_dni(dni)

    if not resultado_dni["valido"]:
        return jsonify({
            "error": resultado_dni["mensaje"]
        }), 400

    resultado_password = AuthService.validar_password(password)

    if not resultado_password["valido"]:
        return jsonify({
            "error": resultado_password["mensaje"]
        }), 400

    return jsonify({
        "message": "Datos de acceso válidos. Autenticación pendiente."
    }), 200


@auth_bp.post("/registro/validar-dni")
def validar_dni():
    data = request.get_json(silent=True) or {}
    dni = data.get("dni")

    resultado = AuthService.validar_dni(dni)

    if not resultado["valido"]:
        return jsonify({
            "error": resultado["mensaje"]
        }), 400

    return jsonify({
        "message": resultado["mensaje"]
    }), 200


@auth_bp.post("/registro/enviar-codigo")
def enviar_codigo():
    data = request.get_json(silent=True) or {}
    correo = data.get("correo")

    resultado = AuthService.validar_correo(correo)

    if not resultado["valido"]:
        return jsonify({
            "error": resultado["mensaje"]
        }), 400

    return jsonify({
        "message": "Correo válido. Envío de código pendiente."
    }), 200


@auth_bp.post("/registro/verificar-codigo")
def verificar_codigo():
    data = request.get_json(silent=True) or {}
    codigo = str(data.get("codigo", "")).strip()

    if not codigo:
        return jsonify({
            "error": "El código de verificación es obligatorio"
        }), 400

    return jsonify({
        "message": "Verificación del código pendiente."
    }), 200


@auth_bp.post("/registro/crear-cuenta")
def crear_cuenta():
    data = request.get_json(silent=True) or {}

    password = data.get("password")

    resultado = AuthService.validar_password(password)

    if not resultado["valido"]:
        return jsonify({
            "error": resultado["mensaje"]
        }), 400

    return jsonify({
        "message": "Datos válidos. Creación de cuenta pendiente."
    }), 200