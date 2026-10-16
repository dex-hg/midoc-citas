"""Comprobar el contrato HTTP inicial, sin implementar funciones del negocio."""

import pytest

from midoc import crear_aplicacion


def prueba_estado_local_no_simula_conexion_supabase() -> None:
    aplicacion = crear_aplicacion({"TESTING": True})
    respuesta = aplicacion.test_client().get("/api/estado")

    assert respuesta.status_code == 200
    assert respuesta.get_json() == {"status": "UP"}
    assert aplicacion.extensions["supabase"] is None


@pytest.mark.parametrize(
    ("ruta", "metodo", "codigo"),
    [("/api/pacientes", "GET", 404), ("/api/estado", "POST", 405)],
)
def prueba_rutas_y_metodos_no_implementados(ruta: str, metodo: str, codigo: int) -> None:
    aplicacion = crear_aplicacion({"TESTING": True})
    respuesta = aplicacion.test_client().open(ruta, method=metodo)

    assert respuesta.status_code == codigo
    assert respuesta.is_json
    assert respuesta.get_json()["error"]["codigo"] == codigo
    if codigo == 405:
        assert "GET" in respuesta.headers["Allow"]
