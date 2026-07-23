package contenttree.auth;

import contenttree.auth.services.JwtService;
import contenttree.auth.services.JwtService.JwtClaims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.Strings;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticatorFilter extends OncePerRequestFilter {

	private final JwtService jwtService;

	private final HandlerExceptionResolver resolver;

	@SuppressWarnings("PMD.CallSuperInConstructor")  // Calling super() has no effect here.
	public JwtAuthenticatorFilter(JwtService jwtService,
	                              @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
		this.jwtService = jwtService;
		this.resolver = resolver;
	}

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain
	) throws ServletException, IOException {
		if (SecurityContextHolder.getContext().getAuthentication() != null) {
			filterChain.doFilter(request, response);
			return;
		}

		final var authHeader = request.getHeader("Authorization");

		if (!Strings.CS.startsWith(authHeader, "Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		final var jwt = authHeader.substring(7);

		try {
			final JwtClaims jwtClaims = jwtService.parseToken(jwt);

			jwtService.validateClaims(jwtClaims);

			SecurityContextHolder.getContext().setAuthentication(
					new UsernamePasswordAuthenticationToken(jwtClaims.username(), null,
							List.of(new SimpleGrantedAuthority("ROLE_" + jwtClaims.role().name()))));

			filterChain.doFilter(request, response);
		} catch (JwtAuthenticationException e) {
			resolver.resolveException(request, response, null, e);
		}
	}

}
