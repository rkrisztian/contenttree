package contenttree.tree.exceptions;

public abstract sealed class ContentTreeServiceException extends RuntimeException
		permits CreateNodeException, NodeNotFoundException, ParentNodeNotFoundException,
		MoveNodeException {
	private final int status;

	protected ContentTreeServiceException(String message, int status) {
		super(message);
		this.status = status;
	}

	protected ContentTreeServiceException(String message, int status, Throwable cause) {
		super(message, cause);
		this.status = status;
	}

	public int getStatus() {
		return status;
	}
}
