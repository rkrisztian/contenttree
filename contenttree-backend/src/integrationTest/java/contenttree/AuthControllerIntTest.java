package contenttree;

import contenttree.auth.UserRepository;
import contenttree.auth.dto.LoginReqDto;
import contenttree.auth.dto.LoginRespDto;
import contenttree.auth.model.User;
import contenttree.util.TestcontainersConfiguration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static contenttree.auth.model.Role.ADMIN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("inttest")
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class AuthControllerIntTest {

	@Autowired
	MockMvc mockMvc;

	@Autowired
	ObjectMapper mapper;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@BeforeEach
	void setUp() {
		userRepository.save(
				new User("testUserForLogin", passwordEncoder.encode("secret"), ADMIN));
	}

	@AfterEach
	void resetDb() {
		userRepository.deleteAll();
	}

	@Test
	@SuppressWarnings("NullAway")
	void shouldAllowAccessingProtectedEndpointAfterLogin() throws Exception {
		final var json = mockMvc.perform(post("/api/auth/login")
						.contentType(APPLICATION_JSON)
						.content(mapper.writeValueAsString(
								new LoginReqDto("testUserForLogin", "secret"))))
				.andExpectAll(
						status().isOk(),
						jsonPath("$.token").isNotEmpty())
				.andReturn().getResponse().getContentAsString();

		var loginRespDto = mapper.readValue(json, LoginRespDto.class);
		assertThat(loginRespDto.getToken()).isNotNull();

		mockMvc.perform(get("/api/tree/content/1")
						.header(AUTHORIZATION, "Bearer " + loginRespDto.getToken()))
				.andExpect(status().isNotFound());
	}

}
