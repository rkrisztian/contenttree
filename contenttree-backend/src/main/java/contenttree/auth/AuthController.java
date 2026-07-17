package contenttree.auth;

import contenttree.auth.dto.LoginReqDto;
import contenttree.auth.dto.LoginRespDto;
import contenttree.auth.services.AuthService;
import contenttree.auth.services.JwtService;
import contenttree.auth.services.JwtService.JwtClaims;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

	public static final String JWT_COOKIE_NAME = "authToken";
	private static final String HAS_ANY_ROLE = "isAuthenticated()";

	private final AuthService authService;
	private final JwtService jwtService;
	private final AuthMapper mapper;

	public AuthController(AuthService authService, JwtService jwtService, AuthMapper mapper) {
		this.authService = authService;
		this.jwtService = jwtService;
		this.mapper = mapper;
	}

	@PostMapping("/login")
	@Operation(summary = "Logs in and generates a JWT token")
	public LoginRespDto login(@Valid @RequestBody LoginReqDto request) {
		final String jwt = authService.authenticate(request.getUsername(), request.getPassword());
		final JwtClaims jwtClaims = jwtService.parseToken(jwt);

		return mapper.toLoginRespDTO(jwt, jwtClaims);
	}

	@PostMapping("/logout")
	@PreAuthorize(HAS_ANY_ROLE)
	@Operation(summary = "Logs out (currently no-op)")
	public void logout(HttpServletResponse response) {
		// No-op for now.
	}

}
