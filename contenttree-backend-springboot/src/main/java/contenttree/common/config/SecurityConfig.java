package contenttree.common.config;

import contenttree.auth.JwtAuthenticatorFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpMethod.OPTIONS;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final String[] allowedOrigins;

	private final JwtAuthenticatorFilter jwtAuthenticatorFilter;

	public SecurityConfig(
			@Value("${app.cors.allowed-origins}") String[] allowedOrigins,
			JwtAuthenticatorFilter jwtAuthenticatorFilter) {
		this.allowedOrigins = allowedOrigins.clone();
		this.jwtAuthenticatorFilter = jwtAuthenticatorFilter;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) {
		return http
				.csrf(AbstractHttpConfigurer::disable)  // NOSONAR: JWT is stored in localStorage
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.sessionManagement(session -> session
						.sessionCreationPolicy(STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(OPTIONS, "/**").permitAll()  // Allow preflight
						.requestMatchers("/api/auth/**").permitAll()
						.requestMatchers("/api/tree", "/api/tree/**").authenticated()
						.anyRequest().permitAll())
				.headers(headers -> headers
						.contentSecurityPolicy(csp -> csp
								.policyDirectives("default-src 'self'; script-src 'self'; "
										+ "object-src 'none'; base-uri 'self';")))
				.addFilterBefore(jwtAuthenticatorFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		final var configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("*"));
		configuration.setMaxAge(3600L);
		configuration.setAllowCredentials(true);

		final var source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", configuration);
		return source;
	}

	@Bean
	public static RoleHierarchy roleHierarchy() {
		return RoleHierarchyImpl.withDefaultRolePrefix()
				.role("ADMIN").implies("MANAGER")
				.role("MANAGER").implies("READER")
				.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
