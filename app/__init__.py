from flask import Flask, jsonify
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "http://localhost:5173"
            }
        }
    )

    @app.get("/api/health")
    def health():
        return jsonify({
            "status": "ok",
            "message": "MiDoc Backend funcionando correctamente"
        }), 200

    return app
