package contenttree.tree;

import contenttree.tree.exceptions.CreateNodeException;
import contenttree.tree.exceptions.MoveNodeException;
import contenttree.tree.exceptions.NodeNotFoundException;
import contenttree.tree.exceptions.ParentNodeNotFoundException;
import contenttree.tree.model.TreeNode;
import contenttree.tree.model.TreeNodeWithContent;
import contenttree.tree.repository.TreeNodeRepository;
import contenttree.tree.repository.TreeNodeWithContentRepository;
import org.jspecify.annotations.Nullable;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.doNothing;

@ExtendWith(MockitoExtension.class)
class ContentTreeServiceTest {

	final TreeNodeWithContent rootNode = createTreeNodeWithContent(1L, "dummy text", "dummy content", null);
	final TreeNodeWithContent childNode = createTreeNodeWithContent(2L, "dummy text 2", "dummy content 2", rootNode.getId());
	final TreeNodeWithContent grandchildNode = createTreeNodeWithContent(3L, "dummy text 3", "dummy content 3", childNode.getId());
	final TreeNodeWithContent childNode2 = createTreeNodeWithContent(4L, "dummy text 4", "dummy content 4", rootNode.getId());

	@Autowired
	@InjectMocks
	ContentTreeService service;

	@Mock
	TreeNodeWithContentRepository treeNodeWithContentRepository;

	@Mock
	TreeNodeRepository treeNodeRepository;

	@Nested
	class CreateNodeTest {

		@Test
		void shouldCreateRootNode() {
			given(treeNodeWithContentRepository.existsByParentId(null)).willReturn(false);
			given(treeNodeWithContentRepository.save(rootNode)).willReturn(rootNode);

			service.createNode(rootNode);

			then(treeNodeWithContentRepository).should().save(rootNode);
		}

		@Test
		void shouldNotCreateRootNodeTwice() {
			given(treeNodeWithContentRepository.existsByParentId(null)).willReturn(true);

			assertThatThrownBy(
					() -> service.createNode(rootNode)
			).isInstanceOf(CreateNodeException.class);
		}

		@Test
		void shouldCreateChildNode() {
			given(treeNodeWithContentRepository.existsById(rootNode.getId())).willReturn(true);
			given(treeNodeWithContentRepository.save(childNode)).willReturn(childNode);

			service.createNode(childNode);

			then(treeNodeWithContentRepository).should().save(childNode);
		}

		@Test
		void shouldNotCreateNodeWithMissingParent() {
			given(treeNodeWithContentRepository.existsById(rootNode.getId())).willReturn(false);

			assertThatThrownBy(
					() -> service.createNode(childNode)
			).isInstanceOf(ParentNodeNotFoundException.class);
		}
	}

	@Nested
	class UpdateNodeTest {

		@Test
		void shouldUpdateExistingNode() {
			given(treeNodeWithContentRepository.findById(rootNode.getId())).willReturn(Optional.of(rootNode));
			given(treeNodeWithContentRepository.save(rootNode)).willReturn(rootNode);

			service.updateNode(rootNode);

			then(treeNodeWithContentRepository).should().save(rootNode);
		}

		@Test
		void shouldNotUpdateMissingNode() {
			given(treeNodeWithContentRepository.findById(rootNode.getId())).willReturn(Optional.empty());

			assertThatThrownBy(
					() -> service.updateNode(rootNode)
			).isInstanceOf(NodeNotFoundException.class);
		}
	}

	@Nested
	class DeleteNodeTest {

		@Test
		void shouldDeleteSingleNode() {
			given(treeNodeRepository.existsById(rootNode.getId())).willReturn(true);
			doNothing().when(treeNodeRepository).deleteByIdRecursively(rootNode.getId());

			service.deleteNode(rootNode.getId());

			then(treeNodeRepository).should().deleteByIdRecursively(rootNode.getId());
		}

		@SuppressWarnings("java:S5778")  // Trivial getter
		@Test
		void shouldNotDeleteNonExistingNode() {
			given(treeNodeRepository.existsById(rootNode.getId())).willReturn(false);

			assertThatThrownBy(
					() -> service.deleteNode(rootNode.getId())
			).isInstanceOf(NodeNotFoundException.class);
		}
	}

	@Nested
	class MoveNodeTest {

		@Test
		void shouldMoveNodeToValidParent() {
			given(treeNodeRepository.findById(childNode.getId()))
					.willReturn(Optional.of(asTreeNode(childNode)));
			given(treeNodeRepository.findById(childNode2.getId()))
					.willReturn(Optional.of(asTreeNode(childNode2)));
			given(treeNodeRepository.save(any(TreeNode.class))).will(returnsFirstArg());

			var updatedChildNode = service.moveNode(childNode.getId(), childNode2.getId());

			then(treeNodeRepository).should().save(updatedChildNode);
			assertThat(updatedChildNode.getParent().getId()).isEqualTo(childNode2.getId());
		}

		@SuppressWarnings("java:S5778")  // Trivial getter
		@Test
		void shouldNotMoveNodeToParentAsSelf() {
			assertThatThrownBy(
					() -> service.moveNode(childNode.getId(), childNode.getId())
			).isInstanceOf(MoveNodeException.class);
		}

		@SuppressWarnings("java:S5778")  // Trivial getter
		@Test
		void shouldNotMoveNodeToMissingParent() {
			given(treeNodeRepository.findById(grandchildNode.getId()))
					.willReturn(Optional.of(asTreeNode(grandchildNode)));

			assertThatThrownBy(
					() -> service.moveNode(grandchildNode.getId(), rootNode.getId())
			).isInstanceOf(ParentNodeNotFoundException.class);
		}

		@SuppressWarnings("java:S5778")  // Trivial getter
		@Test
		void shouldNotMoveRootNode() {
			given(treeNodeRepository.findById(rootNode.getId()))
					.willReturn(Optional.of(asTreeNode(rootNode)));

			assertThatThrownBy(
					() -> service.moveNode(rootNode.getId(), childNode.getId())
			).isInstanceOf(MoveNodeException.class);
		}

		@SuppressWarnings("java:S5778")  // Trivial getter
		@Test
		void shouldNotMoveNodeToSameParent() {
			given(treeNodeRepository.findById(childNode.getId()))
					.willReturn(Optional.of(asTreeNode(childNode)));

			assertThatThrownBy(
					() -> service.moveNode(childNode.getId(), rootNode.getId())
			).isInstanceOf(MoveNodeException.class);
		}

	}

	private TreeNodeWithContent createTreeNodeWithContent(Long id, String name, String content,
	                                                      @Nullable Long parentId) {
		var node = new TreeNodeWithContent();
		node.setId(id);
		node.setName(name);
		node.setContent(content);

		if (parentId != null) {
			node.setParent(new TreeNodeWithContent());
			node.getParent().setId(parentId);
		}

		return node;
	}

	private TreeNode asTreeNode(TreeNodeWithContent node) {
		TreeNode treeNode = new TreeNode();
		treeNode.setId(node.getId());
		treeNode.setName(node.getName());
		treeNode.setParent(node.getParent() != null ? asTreeNode(node.getParent()) : null);
		treeNode.setChildren(node.getChildren().stream().map(this::asTreeNode).toList());

		return treeNode;
	}

}
