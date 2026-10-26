package contenttree.tree.exceptions;

import org.springframework.http.HttpStatus;

public final class CreateNodeException extends ContentTreeServiceException {
	public CreateNodeException(String message) {
		super(message, HttpStatus.BAD_REQUEST.value());
	}
}
