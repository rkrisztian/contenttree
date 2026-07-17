package contenttree.common.exceptions;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ContentTreeErrorResponse(int status, String error, String message, String path,
                                       String traceId, Object trace, Instant timestamp) {
	public ContentTreeErrorResponse(int status, String error, String message, String path,
	                                String traceId, Object trace) {
		this(status, error, message, path, traceId, trace, Instant.now());
	}
}
