import re


class AuthService:
    @staticmethod
    def validar_dni(dni):
        if not dni:
            return {
                "valido": False,
                "mensaje": "El DNI es obligatorio"
            }

        dni = str(dni).strip()

        if not dni.isdigit() or len(dni) != 8:
            return {
                "valido": False,
                "mensaje": "El DNI debe contener 8 dígitos"
            }

        return {
            "valido": True,
            "mensaje": "DNI válido"
        }

    @staticmethod
    def validar_correo(correo):
        if not correo:
            return {
                "valido": False,
                "mensaje": "El correo es obligatorio"
            }

        correo = correo.strip().lower()

        patron = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

        if not re.match(patron, correo):
            return {
                "valido": False,
                "mensaje": "El correo electrónico no es válido"
            }

        return {
            "valido": True,
            "mensaje": "Correo válido"
        }

    @staticmethod
    def validar_password(password):
        if not password:
            return {
                "valido": False,
                "mensaje": "La contraseña es obligatoria"
            }

        if len(password) < 8:
            return {
                "valido": False,
                "mensaje": "La contraseña debe tener al menos 8 caracteres"
            }

        return {
            "valido": True,
            "mensaje": "Contraseña válida"
        }

    @staticmethod
    def obtener_perfiles_por_rol(rol):
        perfiles = {
            "ADMINISTRADOR": [
                "ADMINISTRADOR",
                "RECEPCION",
                "CLIENTE"
            ],
            "DOCTOR": [
                "DOCTOR",
                "CLIENTE"
            ],
            "RECEPCION": [
                "RECEPCION",
                "CLIENTE"
            ],
            "PROMOTOR_BCP": [
                "PROMOTOR_BCP",
                "CLIENTE"
            ],
            "CLIENTE": [
                "CLIENTE"
            ]
        }

        return perfiles.get(rol, [])