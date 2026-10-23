"""Pruebas de reglas del doctor contra datos sintéticos, sin base de datos."""

import unittest
from dataclasses import replace
from datetime import date, datetime, time, timezone
from unittest.mock import patch

from app.services.doctor_service import (
    CambioEstadoDoctorNoPermitido,
    CitaDoctorNoEncontrada,
    ErrorValidacionDoctor,
    RepositorioDoctorNoDisponible,
    ServicioDoctor,
    ZONA_HORARIA_LIMA,
)
from tests.soporte_doctor import RepositorioDoctorPrueba, crear_citas_prueba


class PruebasServicioDoctor(unittest.TestCase):
    def setUp(self):
        self.repositorio = RepositorioDoctorPrueba()
        self.servicio = ServicioDoctor(self.repositorio)
        self.id_doctor = "doctor-prueba-1"

    def test_citas_del_doctor_ordenadas_por_fecha_y_hora(self):
        resultado = self.servicio.consultar_citas(self.id_doctor)
        self.assertEqual(resultado["total"], 4)
        self.assertEqual(
            [cita["id_cita"] for cita in resultado["citas"]],
            ["cita-prueba-2", "cita-prueba-1", "cita-prueba-4", "cita-prueba-3"],
        )
        self.assertEqual(resultado["citas"][0]["fecha"], "2026-10-20")
        self.assertEqual(resultado["citas"][0]["hora"], "09:00:00")

    def test_filtrar_por_fecha_y_estado_combinados(self):
        resultado = self.servicio.consultar_citas(
            self.id_doctor, "2026-10-20", " agendada "
        )
        self.assertEqual(resultado["total"], 1)
        self.assertEqual(resultado["citas"][0]["id_cita"], "cita-prueba-1")
        self.assertEqual(
            resultado["filtros"], {"fecha": "2026-10-20", "estado": "AGENDADA"}
        )

    def test_filtrar_solo_por_fecha(self):
        resultado = self.servicio.consultar_citas(self.id_doctor, fecha="2026-10-20")
        self.assertEqual(resultado["total"], 3)

    def test_filtrar_solo_por_estado(self):
        for estado in ("AGENDADA", "ATENDIDA", "CANCELADA", "NO_ASISTIO"):
            with self.subTest(estado=estado):
                resultado = self.servicio.consultar_citas(self.id_doctor, estado=estado)
                self.assertEqual(resultado["total"], 1)
                self.assertEqual(resultado["citas"][0]["estado"], estado)

    def test_agenda_se_limita_al_dia_solicitado(self):
        resultado = self.servicio.consultar_agenda(self.id_doctor, "2026-10-21")
        self.assertEqual(resultado["fecha"], "2026-10-21")
        self.assertEqual(resultado["total"], 1)
        self.assertEqual(resultado["citas"][0]["id_cita"], "cita-prueba-3")

    def test_agenda_sin_fecha_usa_el_dia_de_lima(self):
        instante = datetime(2026, 10, 21, 2, 30, tzinfo=timezone.utc)
        with patch("app.services.doctor_service.datetime") as reloj:
            reloj.now.return_value = instante.astimezone(ZONA_HORARIA_LIMA)
            resultado = self.servicio.consultar_agenda(self.id_doctor)
            reloj.now.assert_called_once_with(ZONA_HORARIA_LIMA)
        self.assertEqual(resultado["fecha"], "2026-10-20")
        self.assertEqual(resultado["total"], 3)

    def test_sin_coincidencias_devuelve_lista_vacia(self):
        resultado = self.servicio.consultar_citas(self.id_doctor, "2026-10-22")
        self.assertEqual(resultado["total"], 0)
        self.assertEqual(resultado["citas"], [])

    def test_repositorio_vacio_no_inventa_citas(self):
        servicio = ServicioDoctor(RepositorioDoctorPrueba([]))
        self.assertEqual(servicio.consultar_agenda(self.id_doctor)["citas"], [])

    def test_descartar_citas_ajenas_aunque_el_proveedor_las_devuelva(self):
        with patch.object(
            self.repositorio, "listar_citas", return_value=crear_citas_prueba()
        ):
            resultado = self.servicio.consultar_citas(self.id_doctor)
        self.assertEqual(resultado["total"], 4)
        self.assertTrue(
            all(cita["id_doctor"] == self.id_doctor for cita in resultado["citas"])
        )

    def test_rechazar_fechas_imposibles_y_formatos_ambiguos(self):
        for fecha in ("", "2026-02-29", "2026-13-01", "20/10/2026", "20261020", 123):
            with self.subTest(fecha=fecha), self.assertRaises(ErrorValidacionDoctor):
                self.servicio.consultar_citas(self.id_doctor, fecha=fecha)
        self.assertEqual(ServicioDoctor.validar_fecha("2028-02-29"), date(2028, 2, 29))

    def test_rechazar_estados_desconocidos_y_tipos_invalidos(self):
        for estado in ("", "PENDIENTE", "PROXIMAS", "NO ASISTIO", [], {}, False, 1):
            with self.subTest(estado=estado), self.assertRaises(ErrorValidacionDoctor):
                self.servicio.consultar_citas(self.id_doctor, estado=estado)

    def test_validar_identificadores_sin_depender_del_motor_de_datos(self):
        for identificador in ("", " ", 0, -1, True, [], "../1", "a" * 65):
            with self.subTest(identificador=identificador):
                with self.assertRaises(ErrorValidacionDoctor):
                    self.servicio.consultar_citas(identificador)
        identificadores_validos = (
            1, "doctor-prueba-1", "83b2d954-7504-4dad-9267-0be065ba34f0"
        )
        for identificador in identificadores_validos:
            with self.subTest(identificador=identificador):
                self.assertEqual(
                    ServicioDoctor.validar_identificador(
                        identificador, "identificador"
                    ),
                    str(identificador),
                )

    def test_preparar_ambos_resultados_sin_cambiar_la_cita(self):
        citas_originales = self.repositorio.citas
        for estado in ("ATENDIDA", "NO_ASISTIO"):
            with self.subTest(estado=estado):
                resultado = self.servicio.preparar_estado_cita(
                    self.id_doctor, "cita-prueba-1", estado
                )
                self.assertTrue(resultado["preparado"])
                self.assertFalse(resultado["persistido"])
                self.assertEqual(resultado["estado_actual"], "AGENDADA")
                self.assertEqual(resultado["estado_solicitado"], estado)
        self.assertEqual(self.repositorio.citas, citas_originales)
        self.assertEqual(self.repositorio.citas[0].estado, "AGENDADA")

    def test_no_preparar_cancelaciones_ni_volver_a_agendada(self):
        for estado in ("CANCELADA", "AGENDADA"):
            with self.subTest(estado=estado), self.assertRaises(ErrorValidacionDoctor):
                self.servicio.preparar_estado_cita(
                    self.id_doctor, "cita-prueba-1", estado
                )

    def test_no_alterar_estados_terminales_ni_duplicar_resultados(self):
        for id_cita in ("cita-prueba-2", "cita-prueba-3", "cita-prueba-4"):
            for estado in ("ATENDIDA", "NO_ASISTIO"):
                with self.subTest(id_cita=id_cita, estado=estado):
                    with self.assertRaises(CambioEstadoDoctorNoPermitido):
                        self.servicio.preparar_estado_cita(
                            self.id_doctor, id_cita, estado
                        )

    def test_cita_inexistente_y_ajena_generan_el_mismo_error(self):
        for id_cita in ("cita-inexistente", "cita-prueba-ajena"):
            with self.subTest(id_cita=id_cita):
                with self.assertRaises(CitaDoctorNoEncontrada):
                    self.servicio.preparar_estado_cita(
                        self.id_doctor, id_cita, "ATENDIDA"
                    )

    def test_verificar_propiedad_e_identificador_devuelto_por_el_proveedor(self):
        for cita in (self.repositorio.citas[-1], self.repositorio.citas[1]):
            with self.subTest(id_cita=cita.id_cita):
                with patch.object(self.repositorio, "obtener_cita", return_value=cita):
                    with self.assertRaises(CitaDoctorNoEncontrada):
                        self.servicio.preparar_estado_cita(
                            self.id_doctor, "cita-prueba-1", "ATENDIDA"
                        )

    def test_sin_proveedor_no_simular_lecturas_o_preparaciones(self):
        servicio = ServicioDoctor()
        with self.assertRaises(RepositorioDoctorNoDisponible):
            servicio.consultar_citas(self.id_doctor)
        with self.assertRaises(RepositorioDoctorNoDisponible):
            servicio.preparar_estado_cita(self.id_doctor, "cita-prueba-1", "ATENDIDA")

    def test_validar_entradas_antes_de_consultar_el_proveedor(self):
        with patch.object(self.repositorio, "listar_citas") as consulta:
            with self.assertRaises(ErrorValidacionDoctor):
                self.servicio.consultar_citas(self.id_doctor, fecha="2026-02-30")
            consulta.assert_not_called()

    def test_informar_fallos_de_acceso_a_los_datos(self):
        with patch.object(self.repositorio, "listar_citas", side_effect=TimeoutError):
            with self.assertRaises(RepositorioDoctorNoDisponible):
                self.servicio.consultar_citas(self.id_doctor)
        with patch.object(self.repositorio, "obtener_cita", side_effect=OSError):
            with self.assertRaises(RepositorioDoctorNoDisponible):
                self.servicio.preparar_estado_cita(
                    self.id_doctor, "cita-prueba-1", "NO_ASISTIO"
                )

    def test_rechazar_respuestas_del_proveedor_con_formato_invalido(self):
        for respuesta in (None, {}, "citas", [object()]):
            with self.subTest(respuesta=respuesta):
                with patch.object(
                    self.repositorio, "listar_citas", return_value=respuesta
                ):
                    with self.assertRaises(RepositorioDoctorNoDisponible):
                        self.servicio.consultar_citas(self.id_doctor)

    def test_rechazar_registros_inconsistentes_del_proveedor(self):
        cita = self.repositorio.citas[0]
        cambios = (
            {"estado": "DESCONOCIDO"},
            {"fecha": "2026-10-20"},
            {"hora": time(10, tzinfo=timezone.utc)},
            {"duracion_minutos": 0},
            {"duracion_minutos": True},
            {"paciente": " "},
            {"id_cita": None},
        )
        for cambio in cambios:
            with self.subTest(cambio=cambio):
                registro = replace(cita, **cambio)
                with patch.object(
                    self.repositorio, "listar_citas", return_value=[registro]
                ):
                    with self.assertRaises(RepositorioDoctorNoDisponible):
                        self.servicio.consultar_citas(self.id_doctor)


if __name__ == "__main__":
    unittest.main()
