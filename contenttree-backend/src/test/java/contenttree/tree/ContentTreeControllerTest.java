package contenttree.tree;

import contenttree.auth.services.JwtService;
import contenttree.common.config.SecurityConfig;
import contenttree.tree.exceptions.MoveNodeException;
import contenttree.tree.exceptions.NodeNotFoundException;
import contenttree.tree.exceptions.ParentNodeNotFoundException;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willDoNothing;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContentTreeController.class)
@ActiveProfiles("test")
@Import({SecurityConfig.class})
class ContentTreeControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockitoBean
	ContentTreeService service;

	@MockitoBean
	ContentTreeMapper mapper;

	@MockitoBean
	JwtService jwtService;

	@Nested
	class DeleteNodeTest {

		@Test
		@WithMockUser(username = "testUser", roles = {"MANAGER"})
		void shouldReturn404WhenDeletingNonExistentNode() throws Exception {
			willThrow(new NodeNotFoundException()).given(service).deleteNode(1L);

			mockMvc.perform(delete("/api/tree/1"))
					.andExpect(status().isNotFound());
		}

	}

	@Nested
	class GetContentTest {

		@Test
		@WithMockUser(username = "testUser", roles = {"READER"})
		void shouldReturn404WhenLoadingContentOfNonExistentNode() throws Exception {
			given(service.getContentById(1L)).willThrow(new NodeNotFoundException());

			mockMvc.perform(get("/api/tree/content/1"))
					.andExpect(status().isNotFound());
		}

	}

	@Nested
	class MoveNodeTest {

		@Test
		@WithMockUser(username = "testUser", roles = {"MANAGER"})
		void shouldReturn400WhenServiceThrowsValidationException() throws Exception {
			given(service.moveNode(1L, 1L))
					.willThrow(new MoveNodeException("Dummy text"));

			mockMvc.perform(post("/api/tree/move")
							.param("nodeId", "1")
							.param("newParentId", "1"))
					.andExpect(status().isBadRequest());
		}

		@Test
		@WithMockUser(username = "testUser", roles = {"MANAGER"})
		void shouldReturn404WhenMovingNodeToNonExistentParent() throws Exception {
			given(service.moveNode(1L, 1L)).willThrow(new ParentNodeNotFoundException());

			mockMvc.perform(post("/api/tree/move")
							.param("nodeId", "1")
							.param("newParentId", "1"))
					.andExpect(status().isNotFound());
		}

	}

	@Nested
	class AuthorizationTest {

		@Test
		@WithAnonymousUser
		void shouldReturn403WhenSearchingWithoutReaderRole() throws Exception {
			mockMvc.perform(get("/api/tree/search").param("text", "text"))
					.andExpect(status().isForbidden());
		}

		@Test
		@WithMockUser(username = "testUser", roles = {"READER"})
		void shouldReturn403WhenDeletingWithoutManagerRole() throws Exception {
			mockMvc.perform(delete("/api/tree/1"))
					.andExpect(status().isForbidden());
		}

		@Test
		@WithMockUser(username = "testUser", roles = {"ADMIN"})
		void shouldReturn200WhenDeletingWithAdminRole() throws Exception {
			willDoNothing().given(service).deleteNode(1L);

			mockMvc.perform(delete("/api/tree/1"))
					.andExpect(status().isOk());
		}

	}

}
