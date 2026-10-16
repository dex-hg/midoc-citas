"""Entorno aislado para no utilizar la configuración privada del desarrollador."""

from collections.abc import Iterator

import pytest


@pytest.fixture
def modificar_entorno() -> Iterator[pytest.MonkeyPatch]:
    with pytest.MonkeyPatch.context() as cambios:
        yield cambios


@pytest.fixture(autouse=True)
def aislar_configuracion(modificar_entorno: pytest.MonkeyPatch) -> None:
    for variable, valor in {
        "MIDOC_MODO": "local",
        "SUPABASE_URL": "",
        "SUPABASE_PUBLISHABLE_KEY": "",
    }.items():
        modificar_entorno.setenv(variable, valor)
