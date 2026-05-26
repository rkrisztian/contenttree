package contenttree.exceptions;

import org.springframework.http.HttpStatus;

public final class NodeNotFoundException extends ContentTreeServiceException {
	public NodeNotFoundException() {
		super("Node not found", HttpStatus.NOT_FOUND.value());
	}

	public NodeNotFoundException(Exception ex) {
		super("Node not found", HttpStatus.NOT_FOUND.value(), ex);
	}
}
