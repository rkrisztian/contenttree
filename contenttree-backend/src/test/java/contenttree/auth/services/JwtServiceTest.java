package contenttree.auth.services;

import contenttree.auth.JwtAuthenticationException;
import contenttree.auth.services.JwtService.JwtClaims;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import static contenttree.auth.model.Role.READER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mockStatic;

@SpringBootTest(classes = JwtService.class)
@TestPropertySource(properties = {
		"app.jwt.secret=this-is-a-local-secret-for-testing-purposes-only",
		"app.jwt.expirationMs=3600000"
})
class JwtServiceTest {

	@Autowired
	JwtService jwtService;

	@Test
	@DisplayName("should generate and validate token")
	void shouldGenerateTokenWithValidClaims() {
		var token = jwtService.generateToken("testUser", READER);
		JwtClaims jwtClaims = jwtService.parseToken(token);

		Assertions.assertThatCode(() -> jwtService.validateClaims(jwtClaims))
				.doesNotThrowAnyException();
		assertThat(jwtClaims)
				.extracting(JwtClaims::username, JwtClaims::role)
				.isEqualTo(List.of("testUser", READER));
		assertThat(jwtClaims.expiration()).isAfter(jwtClaims.issuedAt());
	}

	@Test
	void shouldThrowWhenValidatingMalformedToken() {
		var invalidToken = "invalidToken";

		assertThatThrownBy(() -> jwtService.parseToken(invalidToken))
				.isInstanceOf(JwtAuthenticationException.class);
	}

	@Test
	@SuppressWarnings("ReturnValueIgnored")
	void shouldThrowWhenValidatingExpiredToken() {
		var token = jwtService.generateToken("testUser", READER);
		var oneHourAgo = Instant.now().plus(Duration.ofHours(1));
		var jwtClaims = jwtService.parseToken(token);

		try (var mockedStatic = mockStatic(Instant.class)) {
			mockedStatic.when(Instant::now).thenReturn(oneHourAgo);

			assertThatThrownBy(() -> jwtService.validateClaims(jwtClaims))
					.isInstanceOf(JwtAuthenticationException.class);
		}
	}

}
