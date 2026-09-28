package contenttree.tree;

import contenttree.tree.exceptions.CreateNodeException;
import contenttree.tree.exceptions.MoveNodeException;
import contenttree.tree.exceptions.NodeNotFoundException;
import contenttree.tree.exceptions.ParentNodeNotFoundException;
import contenttree.tree.model.TreeNode;
import contenttree.tree.model.TreeNodeWithContent;
import contenttree.tree.repository.TreeNodeRepository;
import contenttree.tree.repository.TreeNodeWithContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class ContentTreeService {

	private final TreeNodeRepository treeNodeRepository;

	private final TreeNodeWithContentRepository treeNodeWithContentRepository;

	public ContentTreeService(TreeNodeRepository treeNodeRepository,
							  TreeNodeWithContentRepository treeNodeWithContentRepository) {
		this.treeNodeRepository = treeNodeRepository;
		this.treeNodeWithContentRepository = treeNodeWithContentRepository;
	}

	@Transactional
	public TreeNodeWithContent createNode(TreeNodeWithContent node) {
		if (node.isRoot() && treeNodeWithContentRepository.existsByParentId(null)) {
			throw new CreateNodeException("Root node already exists");
		}
		if (!node.isRoot() && !treeNodeWithContentRepository.existsById(node.getParent().getId())) {
			throw new ParentNodeNotFoundException();
		}

		return treeNodeWithContentRepository.save(node);
	}

	@Transactional
	public void updateNode(TreeNodeWithContent input) {
		final var node = treeNodeWithContentRepository.findById(input.getId())
				.orElseThrow(NodeNotFoundException::new);

		node.setName(input.getName());
		node.setContent(input.getContent());
	}

	@Transactional
	public void deleteNode(Long id) {
		if (!treeNodeRepository.existsById(id)) {
			throw new NodeNotFoundException();
		}

		treeNodeRepository.deleteByIdRecursively(id);
	}

	public List<TreeNode> getTree() {
		return treeNodeRepository.findAll();
	}

	@Transactional
	public String getContentById(Long id) {
		return treeNodeWithContentRepository.findById(id)
				.orElseThrow(NodeNotFoundException::new)
				.getContent();
	}

	@Transactional
	public List<Long> findText(String substring) {
		return treeNodeWithContentRepository.findByNameOrContentContainingIgnoreCase(substring);
	}

	@Transactional
	public void moveNode(Long nodeId, Long newParentId) {
		validateMove(nodeId, newParentId);
		treeNodeRepository.setParentId(nodeId, newParentId);
	}

	@SuppressWarnings("PMD.CyclomaticComplexity")  // This method already does only one thing.
	private void validateMove(Long nodeId, Long newParentId) {
		if (Objects.equals(newParentId, nodeId)) {
			throw new MoveNodeException("Parent node cannot be self");
		}

		final var node = treeNodeRepository.findById(nodeId)
				.orElseThrow(NodeNotFoundException::new);

		if (node.isRoot()) {
			throw new MoveNodeException("Root node cannot be moved");
		}
		if (Objects.equals(node.getParent().getId(), newParentId)) {
			throw new MoveNodeException("Move would have no effect");
		}
		if (treeNodeRepository.isDescendant(newParentId, nodeId)) {
			throw new MoveNodeException("Node cannot be moved into a descendant");
		}
		if (!treeNodeRepository.existsById(newParentId)) {
			throw new ParentNodeNotFoundException();
		}
	}

}
