package contenttree.tree.exceptions;

import org.springframework.http.HttpStatus;

public final class ParentNodeNotFoundException extends ContentTreeServiceException {
	public ParentNodeNotFoundException() {
		super("Parent node not found", HttpStatus.NOT_FOUND.value());
	}
}
