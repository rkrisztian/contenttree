package contenttree;

import contenttree.dto.CreateTreeNodeReqDTO;
import contenttree.dto.SearchResultsRespDto;
import contenttree.dto.TreeNodeRespDTO;
import contenttree.dto.UpdateTreeNodeReqDTO;
import contenttree.repository.TreeNodeRepository;
import contenttree.util.TestcontainersConfiguration;
import org.jspecify.annotations.Nullable;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("inttest")
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class ContentTreeControllerIntTest {

	@Autowired
	MockMvc mockMvc;

	@Autowired
	ObjectMapper mapper;

	@Autowired
	TreeNodeRepository repository;

	@AfterEach
	void resetDb() {
		repository.deleteAll();
	}

	@Nested
	class CreateAndDeleteNodeTest {

		@Test
		void shouldCreateAndDeleteTree() throws Exception {
			final var rootNode = createTreeNode("dummy name 1 ", "dummy content", null);
			final var childNode = createTreeNode("dummy name 2", "dummy content 2", rootNode.getId());
			final var grandchildNode = createTreeNode("dummy name 3", "dummy content 3",
					childNode.getId());
			createTreeNode("dummy name 4", "dummy content 4", grandchildNode.getId());
			final var childNode2 = createTreeNode("dummy name 5", "dummy content 5",
					rootNode.getId());

			mockMvc.perform(delete("/api/tree/" + childNode.getId()))
					.andExpect(status().isOk());

			assertThat(getAllTreeNodes()).extracting(TreeNodeRespDTO::getId)
					.containsExactlyInAnyOrder(rootNode.getId(), childNode2.getId());
		}

		@Test
		void shouldListNodesInOrder() throws Exception {
			final var rootNode = createTreeNode("pineapple", "dummy content", null);
			final var childNode1 = createTreeNode("banana", "dummy content 2", rootNode.getId());
			final var childNode2 = createTreeNode("carrot", "dummy content 3", childNode1.getId());
			createTreeNode("apple", "dummy content 4", childNode2.getId());
			createTreeNode("garlic", "dummy content 5", rootNode.getId());

			assertThat(getAllTreeNodes()).extracting(TreeNodeRespDTO::getName)
					.containsExactly("apple", "banana", "carrot", "garlic", "pineapple");
		}

	}

	@Nested
	class UpdateNodeAndGetContentTest {

		@Test
		void shouldUpdateExistingNode() throws Exception {
			final var node = createTreeNode("Original Name", "Original Content", null);

			mockMvc.perform(post("/api/tree")
							.contentType(MediaType.APPLICATION_JSON)
							.content(mapper.writeValueAsString(
									new UpdateTreeNodeReqDTO(node.getId(), "Updated Name",
											"Updated Content"))))
					.andExpectAll(
							status().isOk(),
							jsonPath("$.name").value("Updated Name"));

			mockMvc.perform(get("/api/tree/content/" + node.getId()))
					.andExpectAll(
							status().isOk(),
							jsonPath("$.data").value("Updated Content"));
		}

	}

	@Nested
	class FindContentTest {

		@Test
		void shouldFindNodesByContentOrNameWhenMatching() throws Exception {
			final var node1 = createTreeNode("Alpha", "Root content", null);
			createTreeNode("Beta", "Beta content", node1.getId());
			final var node3 = createTreeNode("Gamma", "Alpha content inside Gamma", node1.getId());

			var json = mockMvc.perform(get("/api/tree/search")
							.param("text", "alpha")
							.contentType(MediaType.APPLICATION_JSON))
					.andExpect(status().isOk())
					.andReturn()
					.getResponse()
					.getContentAsString();
			var searchResult = mapper.readValue(json, SearchResultsRespDto.class);

			assertThat(searchResult.getIds()).containsExactlyInAnyOrder(node1.getId(), node3.getId());
		}

		@Test
		void shouldReturnEmptyListWhenNotMatching() throws Exception {
			final var node1 = createTreeNode("Alpha", "Root content", null);
			createTreeNode("Beta", "Beta content", node1.getId());
			createTreeNode("Gamma", "Alpha content inside Gamma", node1.getId());

			mockMvc.perform(get("/api/tree/search")
							.param("text", "NonExisting")
							.contentType(MediaType.APPLICATION_JSON))
					.andExpectAll(
							status().isOk(),
							jsonPath("$.ids.length()").value(0));
		}

		@Test
		void shouldFindNodesUsingSpecialCharacters() throws Exception {
			final var node1 = createTreeNode("Alpha", "Non-matching content", null);
			createTreeNode("Beta", "first&second=third%20fourth(fifth[", node1.getId());

			mockMvc.perform(get("/api/tree/search")
							.param("text", "first&second=third%20fourth(fifth[")
							.contentType(MediaType.APPLICATION_JSON))
					.andExpectAll(
							status().isOk(),
							jsonPath("$.ids.length()").value(1));
		}

	}

	@Nested
	class MoveNodeTest {

		@Test
		void shouldMoveNodeSuccessfully() throws Exception {
			final var rootNode = createTreeNode("dummy name", "dummy content", null);
			final var childNode = createTreeNode("dummy name 2", "dummy content 2",
					rootNode.getId());
			final var grandchildNode = createTreeNode("dummy name 3", "dummy content 3",
					childNode.getId());

			mockMvc.perform(post("/api/tree/move")
							.param("nodeId", grandchildNode.getId().toString())
							.param("newParentId", rootNode.getId().toString())
							.contentType(MediaType.APPLICATION_JSON))
					.andExpect(status().isOk());

			assertThat(getAllTreeNodes())
					.extracting(TreeNodeRespDTO::getId, TreeNodeRespDTO::getParentId)
					.contains(tuple(grandchildNode.getId(), rootNode.getId()));
		}

		@Test
		void shouldReturn400WhenMovingNodeToOwnDescendant() throws Exception {
			final var rootNode = createTreeNode("dummy name", "dummy content", null);
			final var childNode = createTreeNode("dummy name 2", "dummy content 2",
					rootNode.getId());
			final var grandchildNode = createTreeNode("dummy name 3", "dummy content 3",
					childNode.getId());
			final var grandGrandchildNode = createTreeNode("dummy name 4", "dummy content 4",
					grandchildNode.getId());

			mockMvc.perform(post("/api/tree/move")
							.param("nodeId", childNode.getId().toString())
							.param("newParentId", grandGrandchildNode.getId().toString())
							.contentType(MediaType.APPLICATION_JSON))
					.andExpectAll(
							status().isBadRequest(),
							jsonPath("$.message").value(
									"Node cannot be moved into a descendant")
					);
		}

	}


	private TreeNodeRespDTO createTreeNode(String name, String content, @Nullable Long parentId)
			throws Exception {

		final var json = mockMvc.perform(put("/api/tree")
						.contentType(MediaType.APPLICATION_JSON)
						.content(mapper.writeValueAsString(
								new CreateTreeNodeReqDTO(name, content, parentId))))
				.andExpect(status().isOk())
				.andReturn()
				.getResponse()
				.getContentAsString();

		return mapper.readValue(json, TreeNodeRespDTO.class);
	}

	private List<TreeNodeRespDTO> getAllTreeNodes() throws Exception {
		final var json = mockMvc.perform(get("/api/tree"))
				.andExpect(status().isOk())
				.andReturn()
				.getResponse()
				.getContentAsString();

		return mapper.readValue(json,
				mapper.getTypeFactory().constructCollectionType(List.class, TreeNodeRespDTO.class));
	}

}
