package contenttree.auth.services;

import contenttree.auth.JwtAuthenticationException;
import contenttree.auth.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

	/**
	 * Must be at least 32 bytes long.
	 */
	private final String secretKey;

	/**
	 * Default: 1 hour.
	 */
	private final long jwtExpirationMs;

	public JwtService(@Value("${app.jwt.secret}") String secretKey,
	                  @Value("${app.jwt.expirationMs:3600000}") long jwtExpirationMs) {
		this.secretKey = secretKey;
		this.jwtExpirationMs = jwtExpirationMs;
	}

	public String generateToken(String username, Role role) {
		final var now = Instant.now();

		return Jwts.builder()
				.subject(username)
				.claim("role", role.name())
				.issuedAt(Date.from(Instant.now()))
				.expiration(Date.from(now.plus(Duration.ofMillis(jwtExpirationMs))))
				.signWith(getSigningKey(), Jwts.SIG.HS256)
				.compact();
	}

	public JwtClaims validateTokenAndGetClaims(String token) {
		final var jwtClaims = parseToken(token);

		if (!isValid(jwtClaims)) {
			throw new JwtAuthenticationException("Invalid token");
		}

		return jwtClaims;
	}

	@SuppressWarnings("PMD.LawOfDemeter")  // `.getPayLoad()` is fluent API.
	public JwtClaims parseToken(String token) {
		try {
			final Claims claims = Jwts.parser()
					.verifyWith(getSigningKey())
					.build()
					.parseSignedClaims(token)
					.getPayload();

			return new JwtClaims(
					claims.getSubject(),
					claims.getIssuedAt().toInstant(),
					claims.getExpiration().toInstant(),
					Role.valueOf(claims.get("role", String.class)));
		} catch (JwtException | IllegalArgumentException e) {
			throw new JwtAuthenticationException("Invalid token", e);
		}
	}

	public boolean isValid(JwtClaims claims) {
		return !claims.expiration().isBefore(Instant.now());
	}

	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(
				secretKey.getBytes(StandardCharsets.UTF_8));
	}

	public record JwtClaims(String username, Instant issuedAt, Instant expiration, Role role) {
	}

}
