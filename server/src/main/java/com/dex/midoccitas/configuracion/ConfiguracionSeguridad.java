package com.dex.midoccitas.configuracion;

import jakarta.servlet.DispatcherType;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration(proxyBeanMethods = false)
public class ConfiguracionSeguridad {

    @Bean
    SecurityFilterChain cadenaSeguridad(HttpSecurity seguridad) throws Exception {
        seguridad
                .authorizeHttpRequests(permisos -> permisos
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/estado").permitAll()
                        .anyRequest().denyAll())
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .exceptionHandling(errores -> errores.authenticationEntryPoint(
                        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));

        // CSRF permanece habilitado para las futuras operaciones con sesión.
        return seguridad.build();
    }

    @Bean
    UserDetailsService servicioUsuarios() {
        // Evita generar una cuenta provisional mientras se implementa el acceso.
        return nombreUsuario -> {
            throw new UsernameNotFoundException("El acceso de usuarios aún no está habilitado.");
        };
    }
}
