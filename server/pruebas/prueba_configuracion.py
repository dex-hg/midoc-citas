"""Validaciones de arranque e inicialización local del SDK, sin llamadas remotas."""

import pytest

from midoc import crear_aplicacion


def prueba_rechaza_un_modo_desconocido(modificar_entorno: pytest.MonkeyPatch) -> None:
    modificar_entorno.setenv("MIDOC_MODO", "desconocido")

    with pytest.raises(ValueError, match="MIDOC_MODO"):
        crear_aplicacion()


@pytest.mark.parametrize("variable_faltante", ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY"])
def prueba_supabase_exige_configuracion_completa(variable_faltante: str) -> None:
    ajustes = {
        "MIDOC_MODO": "supabase",
        "SUPABASE_URL": "https://pruebas.supabase.co",
        "SUPABASE_PUBLISHABLE_KEY": "sb_publishable_pruebas_sin_acceso_remoto",
        variable_faltante: "",
    }

    with pytest.raises(ValueError, match=variable_faltante):
        crear_aplicacion(ajustes)


@pytest.mark.parametrize(
    "direccion",
    [
        "no-es-una-url",
        "http://pruebas.supabase.co",
        "https://usuario:clave@pruebas.supabase.co",
        "https://pruebas.supabase.co/ruta",
        "https://pruebas.supabase.co:invalido",
    ],
)
def prueba_rechaza_direcciones_supabase_invalidas(direccion: str) -> None:
    with pytest.raises(ValueError, match="SUPABASE_URL"):
        crear_aplicacion(
            {
                "MIDOC_MODO": "supabase",
                "SUPABASE_URL": direccion,
                "SUPABASE_PUBLISHABLE_KEY": "sb_publishable_pruebas_sin_acceso_remoto",
            }
        )


def prueba_no_admite_claves_privilegiadas_ni_las_expone_en_errores() -> None:
    clave_no_admitida = "sb_secret_valor_solo_para_pruebas"

    with pytest.raises(ValueError, match="clave publicable") as error:
        crear_aplicacion(
            {
                "MIDOC_MODO": "supabase",
                "SUPABASE_URL": "https://pruebas.supabase.co",
                "SUPABASE_PUBLISHABLE_KEY": clave_no_admitida,
            }
        )

    assert clave_no_admitida not in str(error.value)


def prueba_inicializa_el_sdk_sin_autenticar_usuarios() -> None:
    aplicacion = crear_aplicacion(
        {
            "TESTING": True,
            "MIDOC_MODO": "supabase",
            "SUPABASE_URL": "https://pruebas.supabase.co",
            "SUPABASE_PUBLISHABLE_KEY": "sb_publishable_pruebas_sin_acceso_remoto",
        }
    )

    assert aplicacion.extensions["supabase"] is not None
    assert aplicacion.test_client().get("/api/estado").get_json() == {"status": "UP"}
