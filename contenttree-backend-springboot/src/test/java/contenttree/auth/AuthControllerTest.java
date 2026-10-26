package contenttree.auth;

import contenttree.auth.dto.LoginReqDto;
import contenttree.auth.services.AuthService;
import contenttree.auth.services.JwtService;
import contenttree.common.config.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.mockito.BDDMockito.willThrow;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@ActiveProfiles("test")
@Import({SecurityConfig.class})
class AuthControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockitoBean
	AuthService authService;

	@MockitoBean
	JwtService jwtService;

	@Autowired
	ObjectMapper objectMapper;

	@MockitoBean
	AuthMapper authMapper;

	@Test
	@WithMockUser(username = "testUser", roles = {"MANAGER"})
	void shouldReturn401WhenCredentialsAreInvalid() throws Exception {
		willThrow(new BadCredentialsException("test exception"))
				.given(authService).authenticate("testUser", "wrongPassword");

		mockMvc.perform(post("/api/auth/login")
						.contentType(APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(
								new LoginReqDto("testUser", "wrongPassword"))))
				.andExpect(status().isUnauthorized());
	}

}
