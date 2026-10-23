"""Pruebas HTTP reales de Flask con identidad y citas aisladas de prueba."""

import unittest
from unittest.mock import patch

from app import create_app
from app.services.doctor_service import (
    RepositorioDoctorNoDisponible,
    ServicioDoctor,
)
from tests.soporte_doctor import crear_aplicacion_prueba


class PruebasRutasDoctor(unittest.TestCase):
    def setUp(self):
        self.aplicacion, self.repositorio = crear_aplicacion_prueba()
        self.cliente = self.aplicacion.test_client()
        self.ruta_preparar = "/api/doctores/citas/cita-prueba-1/preparar-estado"

    def test_salud_general_y_del_doctor_siguen_disponibles(self):
        cliente = create_app().test_client()
        for ruta in ("/api/health", "/api/doctores/health", "/api/auth/health"):
            with self.subTest(ruta=ruta):
                respuesta = cliente.get(ruta)
                self.assertEqual(respuesta.status_code, 200)
                self.assertEqual(respuesta.get_json()["status"], "ok")

    def test_aplicacion_real_no_inventa_una_sesion_de_doctor(self):
        cliente = create_app().test_client()
        for ruta in ("/api/doctores/agenda", "/api/doctores/citas"):
            with self.subTest(ruta=ruta):
                respuesta = cliente.get(ruta)
                self.assertEqual(respuesta.status_code, 401)
                self.assertTrue(respuesta.is_json)
        respuesta = cliente.post(self.ruta_preparar, json={"estado": "ATENDIDA"})
        self.assertEqual(respuesta.status_code, 401)

    def test_no_aceptar_identidad_en_cabeceras_o_parametros(self):
        cliente = create_app().test_client()
        respuesta = cliente.get(
            "/api/doctores/citas?id_doctor=doctor-prueba-1",
            headers={"X-Doctor-Id": "doctor-prueba-1", "X-Rol": "DOCTOR"},
        )
        self.assertEqual(respuesta.status_code, 401)

    def test_rechazar_otros_roles_en_todas_las_operaciones(self):
        for rol in ("CLIENTE", "RECEPCION", "PROMOTOR_BCP", "ADMINISTRADOR", None):
            with self.subTest(rol=rol):
                self.aplicacion.config["USUARIO_DOCTOR_PRUEBA"]["rol"] = rol
                self.assertEqual(
                    self.cliente.get("/api/doctores/citas").status_code, 403
                )
                self.assertEqual(
                    self.cliente.get("/api/doctores/agenda").status_code, 403
                )
                self.assertEqual(
                    self.cliente.post(
                        self.ruta_preparar, json={"estado": "ATENDIDA"}
                    ).status_code,
                    403,
                )

    def test_rechazar_cuentas_inactivas_y_sesiones_incompletas(self):
        usuarios = (
            {"id_doctor": "doctor-prueba-1", "rol": "DOCTOR", "activo": False},
            {"id_doctor": "doctor-prueba-1", "rol": "DOCTOR", "activo": "true"},
            {"id_doctor": "doctor-prueba-1", "rol": "DOCTOR"},
            {"rol": "DOCTOR", "activo": True},
            {"id_doctor": True, "rol": "DOCTOR", "activo": True},
        )
        for usuario in usuarios:
            with self.subTest(usuario=usuario):
                self.aplicacion.config["USUARIO_DOCTOR_PRUEBA"] = usuario
                self.assertEqual(
                    self.cliente.get("/api/doctores/citas").status_code, 403
                )

    def test_consultar_agenda_del_dia(self):
        respuesta = self.cliente.get("/api/doctores/agenda?fecha=2026-10-20")
        self.assertEqual(respuesta.status_code, 200)
        resultado = respuesta.get_json()
        self.assertEqual(resultado["fecha"], "2026-10-20")
        self.assertEqual(resultado["total"], 3)
        self.assertEqual(resultado["citas"][0]["hora"], "09:00:00")

    def test_agenda_admite_filtro_de_estado(self):
        respuesta = self.cliente.get(
            "/api/doctores/agenda?fecha=2026-10-20&estado=ATENDIDA"
        )
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.get_json()["total"], 1)
        self.assertEqual(respuesta.get_json()["citas"][0]["estado"], "ATENDIDA")

    def test_consultar_citas_con_filtros_combinados(self):
        respuesta = self.cliente.get(
            "/api/doctores/citas?fecha=2026-10-20&estado=agendada"
        )
        self.assertEqual(respuesta.status_code, 200)
        resultado = respuesta.get_json()
        self.assertEqual(resultado["total"], 1)
        self.assertEqual(resultado["id_doctor"], "doctor-prueba-1")
        self.assertEqual(resultado["citas"][0]["id_cita"], "cita-prueba-1")

    def test_citas_sin_filtros_y_sin_coincidencias(self):
        respuesta = self.cliente.get("/api/doctores/citas")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.get_json()["total"], 4)
        respuesta = self.cliente.get("/api/doctores/citas?fecha=2026-12-01")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.get_json()["citas"], [])

    def test_rechazar_filtros_invalidos_duplicados_o_ajenos_al_contrato(self):
        filtros = (
            "fecha=2026-02-30",
            "fecha=20/10/2026",
            "fecha=",
            "estado=PENDIENTE",
            "estado=",
            "estado=ATENDIDA&estado=AGENDADA",
            "fecha=2026-10-20&fecha=2026-10-21",
            "id_doctor=doctor-prueba-2",
            "fehca=2026-10-20",
        )
        for ruta in ("/api/doctores/citas", "/api/doctores/agenda"):
            for filtro in filtros:
                with self.subTest(ruta=ruta, filtro=filtro):
                    respuesta = self.cliente.get(f"{ruta}?{filtro}")
                    self.assertEqual(respuesta.status_code, 400)
                    self.assertEqual(
                        respuesta.get_json()["codigo"], "SOLICITUD_INVALIDA"
                    )

    def test_preparar_atendida_y_no_asistio_sin_persistir(self):
        for estado in ("ATENDIDA", "NO_ASISTIO"):
            with self.subTest(estado=estado):
                respuesta = self.cliente.post(
                    self.ruta_preparar, json={"estado": estado}
                )
                self.assertEqual(respuesta.status_code, 200)
                resultado = respuesta.get_json()
                self.assertTrue(resultado["preparado"])
                self.assertFalse(resultado["persistido"])
                self.assertEqual(resultado["estado_solicitado"], estado)
        respuesta = self.cliente.get("/api/doctores/citas?estado=AGENDADA")
        self.assertEqual(respuesta.get_json()["total"], 1)
        self.assertEqual(self.repositorio.citas[0].estado, "AGENDADA")

    def test_preparacion_no_es_una_ruta_de_actualizacion(self):
        respuesta = self.cliente.patch(self.ruta_preparar, json={"estado": "ATENDIDA"})
        self.assertEqual(respuesta.status_code, 405)

    def test_preparacion_exige_json(self):
        respuesta = self.cliente.post(self.ruta_preparar, data={"estado": "ATENDIDA"})
        self.assertEqual(respuesta.status_code, 415)
        self.assertTrue(respuesta.is_json)

    def test_rechazar_json_malformado_y_cuerpos_con_campos_extra(self):
        cuerpos = (
            "{", "null", "[]", '"ATENDIDA"', "{}",
            '{"estado": "ATENDIDA", "id_doctor": 2}',
        )
        for cuerpo in cuerpos:
            with self.subTest(cuerpo=cuerpo):
                respuesta = self.cliente.post(
                    self.ruta_preparar, data=cuerpo, content_type="application/json"
                )
                self.assertEqual(respuesta.status_code, 400)
                self.assertTrue(respuesta.is_json)

    def test_preparacion_rechaza_estados_no_permitidos_y_parametros_en_url(self):
        for estado in ("AGENDADA", "CANCELADA", "DESCONOCIDO", None, True, []):
            with self.subTest(estado=estado):
                respuesta = self.cliente.post(
                    self.ruta_preparar, json={"estado": estado}
                )
                self.assertEqual(respuesta.status_code, 400)
        respuesta = self.cliente.post(
            self.ruta_preparar + "?estado=NO_ASISTIO", json={"estado": "ATENDIDA"}
        )
        self.assertEqual(respuesta.status_code, 400)

    def test_cita_ajena_e_inexistente_responden_igual(self):
        resultados = []
        for id_cita in ("cita-prueba-ajena", "cita-inexistente"):
            respuesta = self.cliente.post(
                f"/api/doctores/citas/{id_cita}/preparar-estado",
                json={"estado": "ATENDIDA"},
            )
            self.assertEqual(respuesta.status_code, 404)
            resultados.append(respuesta.get_json())
        self.assertEqual(resultados[0], resultados[1])

    def test_estado_terminal_produce_conflicto(self):
        for id_cita in ("cita-prueba-2", "cita-prueba-3", "cita-prueba-4"):
            with self.subTest(id_cita=id_cita):
                respuesta = self.cliente.post(
                    f"/api/doctores/citas/{id_cita}/preparar-estado",
                    json={"estado": "ATENDIDA"},
                )
                self.assertEqual(respuesta.status_code, 409)
                self.assertEqual(
                    respuesta.get_json()["codigo"], "CAMBIO_ESTADO_NO_PERMITIDO"
                )

    def test_sin_almacenamiento_no_devolver_exitos_o_datos_falsos(self):
        self.aplicacion.extensions.pop("servicio_doctor")
        for ruta in ("/api/doctores/citas", "/api/doctores/agenda"):
            with self.subTest(ruta=ruta):
                respuesta = self.cliente.get(ruta)
                self.assertEqual(respuesta.status_code, 503)
                self.assertEqual(
                    respuesta.get_json()["codigo"], "ALMACENAMIENTO_NO_DISPONIBLE"
                )
        respuesta = self.cliente.post(self.ruta_preparar, json={"estado": "NO_ASISTIO"})
        self.assertEqual(respuesta.status_code, 503)

    def test_fallo_del_proveedor_responde_sin_datos_parciales(self):
        with patch.object(self.repositorio, "listar_citas", side_effect=TimeoutError):
            respuesta = self.cliente.get("/api/doctores/citas")
        self.assertEqual(respuesta.status_code, 503)
        self.assertNotIn("citas", respuesta.get_json())

    def test_error_inesperado_no_expone_detalles_internos(self):
        with patch.object(
            self.repositorio,
            "listar_citas",
            side_effect=RuntimeError("detalle-interno-prueba"),
        ):
            with self.assertLogs(self.aplicacion.logger, level="ERROR"):
                respuesta = self.cliente.get("/api/doctores/citas")
        self.assertEqual(respuesta.status_code, 500)
        self.assertNotIn("detalle-interno-prueba", respuesta.get_data(as_text=True))

    def test_respetar_errores_especificos_del_futuro_adaptador(self):
        class ErrorAdaptadorPrueba(RepositorioDoctorNoDisponible):
            """Ejemplo de error especializado de un adaptador futuro."""

        with patch.object(
            self.repositorio,
            "listar_citas",
            side_effect=ErrorAdaptadorPrueba("El proveedor no está disponible."),
        ):
            respuesta = self.cliente.get("/api/doctores/citas")
        self.assertEqual(respuesta.status_code, 503)
        self.assertEqual(
            respuesta.get_json()["codigo"], "ALMACENAMIENTO_NO_DISPONIBLE"
        )

    def test_servicio_sin_proveedor_y_servicio_mal_configurado(self):
        self.aplicacion.extensions["servicio_doctor"] = ServicioDoctor()
        self.assertEqual(self.cliente.get("/api/doctores/citas").status_code, 503)
        self.aplicacion.extensions["servicio_doctor"] = object()
        with self.assertLogs(self.aplicacion.logger, level="ERROR"):
            respuesta = self.cliente.get("/api/doctores/citas")
        self.assertEqual(respuesta.status_code, 500)


if __name__ == "__main__":
    unittest.main()
