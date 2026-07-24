package contenttree.auth;

import contenttree.auth.dto.LoginReqDto;
import contenttree.auth.dto.LoginRespDto;
import contenttree.auth.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

	private final AuthService authService;
	private final AuthMapper mapper;

	public AuthController(AuthService authService, AuthMapper mapper) {
		this.authService = authService;
		this.mapper = mapper;
	}

	@PostMapping("/login")
	@Operation(summary = "Logs in and generates a JWT token")
	public LoginRespDto login(@Valid @RequestBody LoginReqDto request) {
		return mapper.toLoginRespDTO(
				authService.authenticate(request.getUsername(), request.getPassword()));
	}

}
