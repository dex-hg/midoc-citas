import os

from flask import Flask, jsonify
from flask_cors import CORS

from app.routes.auth_routes import auth_bp
from app.routes.cliente_routes import cliente_bp
from app.routes.doctor_routes import doctor_bp
from app.routes.recepcion_routes import recepcion_bp
from app.routes.promotor_routes import promotor_bp
from app.routes.administrador_routes import administrador_bp


def create_app():
    app = Flask(__name__)

    frontend_url = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": frontend_url
            }
        }
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(cliente_bp)
    app.register_blueprint(doctor_bp)
    app.register_blueprint(recepcion_bp)
    app.register_blueprint(promotor_bp)
    app.register_blueprint(administrador_bp)

    @app.get("/api/health")
    def health():
        return jsonify({
            "status": "ok",
            "message": "MiDoc Backend funcionando correctamente"
        }), 200

    return app
