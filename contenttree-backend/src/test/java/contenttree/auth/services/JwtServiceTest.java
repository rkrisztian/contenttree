package contenttree.auth.services;

import contenttree.auth.JwtAuthenticationException;
import contenttree.auth.services.JwtService.JwtClaims;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.List;

import static contenttree.auth.model.Role.READER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

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
	void shouldReturnValidClaimsAfterGenerateAndValidate() {
		var token = jwtService.generateToken("testUser", READER);
		JwtClaims claims = jwtService.validateTokenAndGetClaims(token);

		assertThat(claims)
				.extracting(JwtClaims::username, JwtClaims::role)
				.isEqualTo(List.of("testUser", READER));
		assertThat(claims.expiration()).isAfter(claims.issuedAt());
	}

	@Test
	void shouldThrowWhenValidatingMalformedToken() {
		var invalidToken = "invalidToken";

		assertThatThrownBy(() -> jwtService.validateTokenAndGetClaims(invalidToken))
				.isInstanceOf(JwtAuthenticationException.class);
	}

}
