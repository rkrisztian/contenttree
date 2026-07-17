package contenttree.common.exceptions;

import contenttree.auth.JwtAuthenticationException;
import contenttree.common.config.TraceIdFilter;
import contenttree.tree.exceptions.ContentTreeServiceException;
import jakarta.validation.ValidationException;
import org.apache.commons.lang3.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.lang.invoke.MethodHandles;
import java.util.Objects;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

	private final Environment environment;

	public GlobalExceptionHandler(Environment environment) {
		this.environment = environment;
	}

	@ExceptionHandler(ContentTreeServiceException.class)
	@SuppressWarnings("unused")
	public ResponseEntity<ContentTreeErrorResponse> handleBusinessException(
			ContentTreeServiceException ex, WebRequest req) {
		return handleException(
				ex.getStatus(),
				"Content tree service error",
				ex.getMessage(),
				ex,
				req);
	}

	@ExceptionHandler(JwtAuthenticationException.class)
	@SuppressWarnings("unused")
	public ResponseEntity<ContentTreeErrorResponse> handleJwtAuthenticationException(Exception ex, WebRequest req) {
		return handleException(
				HttpStatus.UNAUTHORIZED.value(),
				"Authentication Error",
				ex.getMessage(),
				ex,
				req);
	}

	@ExceptionHandler(AuthenticationException.class)
	@SuppressWarnings("unused")
	public ResponseEntity<ContentTreeErrorResponse> handleAuthenticationException(Exception ex, WebRequest req) {
		return handleException(
				HttpStatus.UNAUTHORIZED.value(),
				"Authentication Error",
				"Invalid credentials or access denied",
				ex,
				req);
	}

	@ExceptionHandler(AuthorizationDeniedException.class)
	@SuppressWarnings("unused")
	public ResponseEntity<ContentTreeErrorResponse> handleAuthorizationException(Exception ex, WebRequest req) {
		return handleException(
				HttpStatus.FORBIDDEN.value(),
				"Authorization Error",
				"Permission denied",
				ex,
				req);
	}

	@ExceptionHandler(ValidationException.class)
	@SuppressWarnings("unused")
	public ResponseEntity<ContentTreeErrorResponse> handleValidationException(Exception ex, WebRequest req) {
		return handleException(
				HttpStatus.BAD_REQUEST.value(),
				"Validation Error",
				"Validation failed.",
				ex,
				req);
	}

	@ExceptionHandler(RuntimeException.class)
	@SuppressWarnings("unused")
	public ResponseEntity<ContentTreeErrorResponse> handleAllExceptions(Exception ex, WebRequest req) {
		return handleException(
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Internal Server Error",
				"An internal server error occurred. Please try again later.",
				ex,
				req);
	}

	private ResponseEntity<ContentTreeErrorResponse> handleException(
			int status, String error, String message, Exception ex, WebRequest req) {
		final String traceId = getOrCreateTraceId();

		logger.error("{}: {}", error, ex.getMessage(), ex);

		return ResponseEntity
				.status(status)
				.body(new ContentTreeErrorResponse(
						status,
						error,
						message,
						extractPath(req),
						traceId,
						includeStacktrace() ? ex.getLocalizedMessage() : null));
	}

	private static String getOrCreateTraceId() {
		final String traceId = MDC.get(TraceIdFilter.TRACE_ID_MDC_KEY);

		return Objects.toString(traceId,
				UUID.randomUUID().toString().replace("-", "").substring(0, 16));
	}

	private String extractPath(WebRequest request) {
		return request.getDescription(false).replace("uri=", "");
	}

	private boolean includeStacktrace() {
		return Strings.CI.equals(
				environment.getProperty("server.error.include-stacktrace", "never"),
				"always");
	}

}
