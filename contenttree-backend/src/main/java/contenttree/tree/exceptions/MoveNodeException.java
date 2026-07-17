package contenttree.tree.exceptions;

import org.springframework.http.HttpStatus;

public final class MoveNodeException extends ContentTreeServiceException {
	public MoveNodeException(String message) {
		super(message, HttpStatus.BAD_REQUEST.value());
	}
}
