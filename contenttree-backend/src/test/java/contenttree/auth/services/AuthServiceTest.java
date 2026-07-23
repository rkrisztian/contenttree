package contenttree.auth.services;

import contenttree.auth.UserRepository;
import contenttree.auth.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static contenttree.auth.model.Role.READER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

	@Autowired
	@InjectMocks
	AuthService authService;

	@Mock
	UserRepository userRepository;

	@Spy
	PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	@Mock
	JwtService jwtService;

	@Test
	void shouldReturnTokenWhenCredentialsAreValid() {
		var username = "testUser";
		var password = "testPassword";
		var user = new User(username, passwordEncoder.encode(password), READER);
		var expectedToken = "test-token";

		given(userRepository.findByName(username)).willReturn(Optional.of(user));
		given(jwtService.generateToken(user.getName(), user.getRole())).willReturn(expectedToken);

		var token = authService.authenticate(username, password);

		assertThat(token).isEqualTo(expectedToken);
	}

	@Test
	void shouldThrowWhenUserNotFound() {
		var username = "testUser";
		var password = "dummyPassword";

		given(userRepository.findByName(username)).willReturn(Optional.empty());

		assertThatThrownBy(() -> authService.authenticate(username, password))
				.isInstanceOf(BadCredentialsException.class);
	}

	@Test
	void shouldThrowWhenPasswordIsIncorrect() {
		var username = "testUser";
		var wrongPassword = "wrongPassword";
		var user = new User(username, passwordEncoder.encode("testPassword"), READER);

		given(userRepository.findByName(username)).willReturn(Optional.of(user));
		given(passwordEncoder.matches(wrongPassword, user.getPasswordHash())).willReturn(false);

		assertThatThrownBy(() -> authService.authenticate(username, wrongPassword))
				.isInstanceOf(BadCredentialsException.class);
	}

}
