package contenttree.auth.dto;

import contenttree.auth.model.Role;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public class LoginRespDto {

	@Schema(requiredMode = REQUIRED,
			example = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJNQU5BR0VSIn0.abcdefghijklmnop")
	private String token;

	@Schema(requiredMode = REQUIRED, example = "admin")
	private String username;

	@Schema(requiredMode = REQUIRED, example = "ADMIN")
	private Role role;

	@Schema(requiredMode = REQUIRED, example = "1677445697")
	private Instant expiration;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Instant getExpiration() {
		return expiration;
	}

	public void setExpiration(Instant expiration) {
		this.expiration = expiration;
	}

}
