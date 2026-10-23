"""Datos sintéticos y adaptador de lectura exclusivos de las pruebas."""

from datetime import date, time

from flask import g

from app import create_app
from app.services.doctor_service import CitaDoctor, ServicioDoctor


def crear_citas_prueba() -> list[CitaDoctor]:
    return [
        CitaDoctor(
            id_cita="cita-prueba-1",
            id_doctor="doctor-prueba-1",
            paciente="Paciente de prueba A",
            especialidad="Especialidad de prueba",
            sede="Sede de prueba",
            fecha=date(2026, 10, 20),
            hora=time(11, 0),
            duracion_minutos=30,
            estado="AGENDADA",
        ),
        CitaDoctor(
            id_cita="cita-prueba-2",
            id_doctor="doctor-prueba-1",
            paciente="Paciente de prueba B",
            especialidad="Especialidad de prueba",
            sede="Sede de prueba",
            fecha=date(2026, 10, 20),
            hora=time(9, 0),
            duracion_minutos=30,
            estado="ATENDIDA",
        ),
        CitaDoctor(
            id_cita="cita-prueba-3",
            id_doctor="doctor-prueba-1",
            paciente="Paciente de prueba C",
            especialidad="Especialidad de prueba",
            sede="Sede de prueba",
            fecha=date(2026, 10, 21),
            hora=time(10, 0),
            duracion_minutos=45,
            estado="NO_ASISTIO",
        ),
        CitaDoctor(
            id_cita="cita-prueba-4",
            id_doctor="doctor-prueba-1",
            paciente="Paciente de prueba D",
            especialidad="Especialidad de prueba",
            sede="Sede de prueba",
            fecha=date(2026, 10, 20),
            hora=time(13, 0),
            duracion_minutos=30,
            estado="CANCELADA",
        ),
        CitaDoctor(
            id_cita="cita-prueba-ajena",
            id_doctor="doctor-prueba-2",
            paciente="Paciente de prueba de otro doctor",
            especialidad="Especialidad de prueba",
            sede="Sede de prueba",
            fecha=date(2026, 10, 20),
            hora=time(8, 0),
            duracion_minutos=30,
            estado="AGENDADA",
        ),
    ]


class RepositorioDoctorPrueba:
    """No forma parte de la aplicación ni escribe información persistente."""

    def __init__(self, citas: list[CitaDoctor] | None = None):
        self.citas = tuple(crear_citas_prueba() if citas is None else citas)

    def listar_citas(self, id_doctor: str) -> list[CitaDoctor]:
        return [cita for cita in self.citas if cita.id_doctor == id_doctor]

    def obtener_cita(self, id_doctor: str, id_cita: str) -> CitaDoctor | None:
        return next(
            (
                cita
                for cita in self.citas
                if cita.id_doctor == id_doctor and cita.id_cita == id_cita
            ),
            None,
        )


def crear_aplicacion_prueba():
    aplicacion = create_app()
    aplicacion.config.update(
        TESTING=True,
        USUARIO_DOCTOR_PRUEBA={
            "id_doctor": "doctor-prueba-1",
            "rol": "DOCTOR",
            "activo": True,
        },
    )
    repositorio = RepositorioDoctorPrueba()
    aplicacion.extensions["servicio_doctor"] = ServicioDoctor(repositorio)

    @aplicacion.before_request
    def establecer_identidad_prueba():
        # Este mecanismo existe únicamente en las pruebas, nunca en producción.
        g.usuario_autenticado = aplicacion.config.get("USUARIO_DOCTOR_PRUEBA")

    return aplicacion, repositorio
