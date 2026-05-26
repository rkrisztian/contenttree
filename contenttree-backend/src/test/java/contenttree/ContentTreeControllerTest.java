package contenttree;

import contenttree.exceptions.MoveNodeException;
import contenttree.exceptions.NodeNotFoundException;
import contenttree.exceptions.ParentNodeNotFoundException;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ContentTreeController.class)
@ActiveProfiles("test")
class ContentTreeControllerTest {

	@Autowired
	MockMvc mockMvc;

	@MockitoBean
	ContentTreeService service;

	@MockitoBean
	ContentTreeMapper _mapper;

	@Nested
	class DeleteNodeTest {

		@Test
		void shouldReturn404WhenDeletingNonExistentNode() throws Exception {
			willThrow(new NodeNotFoundException()).given(service).deleteNode(1L);

			mockMvc.perform(delete("/api/tree/1"))
					.andExpect(status().isNotFound());
		}

	}

	@Nested
	class GetContentTest {

		@Test
		void shouldReturn404WhenLoadingContentOfNonExistentNode() throws Exception {
			given(service.getContentById(1L)).willThrow(new NodeNotFoundException());

			mockMvc.perform(get("/api/tree/content/1"))
					.andExpect(status().isNotFound());
		}

	}

	@Nested
	class MoveNodeTest {

		@Test
		void shouldReturn400WhenServiceThrowsValidationException() throws Exception {
			given(service.moveNode(1L, 1L))
					.willThrow(new MoveNodeException("Dummy text"));

			mockMvc.perform(post("/api/tree/move")
							.param("nodeId", "1")
							.param("newParentId", "1"))
					.andExpect(status().isBadRequest());
		}

		@Test
		void shouldReturn404WhenMovingNodeToNonExistentParent() throws Exception {
			given(service.moveNode(1L, 1L)).willThrow(new ParentNodeNotFoundException());

			mockMvc.perform(post("/api/tree/move")
							.param("nodeId", "1")
							.param("newParentId", "1"))
					.andExpect(status().isNotFound());
		}

	}

}
