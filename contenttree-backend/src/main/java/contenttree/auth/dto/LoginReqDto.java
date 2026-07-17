package contenttree.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class LoginReqDto {

	@NotNull
	@NotBlank
	@Schema(example = "admin")
	private String username;

	@NotNull
	@NotBlank
	@Schema(example = "secret")
	private String password;

	public LoginReqDto() {
	}

	public LoginReqDto(String username, String password) {
		this.username = username;
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
