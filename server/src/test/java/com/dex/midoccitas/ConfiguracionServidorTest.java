package com.dex.midoccitas;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("local")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ConfiguracionServidorTest {

    @Value("${local.server.port}")
    private int puerto;

    @Test
    void permiteConsultarElEstadoSinExponerDetalles() throws Exception {
        HttpResponse<String> respuesta = enviarSolicitud("/api/estado", "GET");

        assertThat(respuesta.statusCode()).isEqualTo(200);
        assertThat(respuesta.body())
                .contains("\"status\":\"UP\"")
                .doesNotContain("\"components\"", "\"details\"");
    }

    @Test
    void rechazaElAccesoALasDemasRutas() throws Exception {
        HttpResponse<String> respuesta = enviarSolicitud("/api/pacientes", "GET");

        assertThat(respuesta.statusCode()).isEqualTo(401);
    }

    @Test
    void rechazaEscriturasSinProteccionCsrf() throws Exception {
        HttpResponse<String> respuesta = enviarSolicitud("/api/pacientes", "POST");

        assertThat(respuesta.statusCode()).isEqualTo(403);
    }

    private HttpResponse<String> enviarSolicitud(String ruta, String metodo) throws Exception {
        HttpRequest solicitud = HttpRequest.newBuilder()
                .uri(URI.create("http://127.0.0.1:" + puerto + ruta))
                .timeout(Duration.ofSeconds(10))
                .method(metodo, HttpRequest.BodyPublishers.noBody())
                .build();

        try (HttpClient cliente = HttpClient.newHttpClient()) {
            return cliente.send(solicitud, HttpResponse.BodyHandlers.ofString());
        }
    }
}
