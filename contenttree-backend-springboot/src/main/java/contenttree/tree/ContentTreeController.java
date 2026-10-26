package contenttree.tree;

import contenttree.tree.dto.ContentRespDto;
import contenttree.tree.dto.CreateTreeNodeReqDTO;
import contenttree.tree.dto.TreeNodeRespDTO;
import contenttree.tree.dto.UpdateTreeNodeReqDTO;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tree")
@Validated
@EnableMethodSecurity
public class ContentTreeController {

	private static final String HAS_MANAGER_ROLE = "hasRole('MANAGER')";
	private static final String HAS_ANY_ROLE = "isAuthenticated()";

	private final ContentTreeService service;
	private final ContentTreeMapper mapper;

	public ContentTreeController(ContentTreeService service, ContentTreeMapper mapper) {
		this.service = service;
		this.mapper = mapper;
	}

	@PutMapping
	@Operation(summary = "Creates a new node with the given name and content")
	@PreAuthorize(HAS_MANAGER_ROLE)
	public Long createNode(@Valid @RequestBody CreateTreeNodeReqDTO dto) {
		return service.createNode(
				mapper.toTreeNodeWithContent(dto)
		).getId();
	}

	@PostMapping
	@Operation(summary = "Updates an existing node with the given name and content")
	@PreAuthorize(HAS_MANAGER_ROLE)
	public void updateNode(@Valid @RequestBody UpdateTreeNodeReqDTO dto) {
		service.updateNode(
				mapper.toTreeNodeWithContent(dto));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Deletes a node with all children recursively")
	@PreAuthorize(HAS_MANAGER_ROLE)
	public void deleteNode(@PathVariable("id") Long id) {
		service.deleteNode(id);
	}

	@GetMapping
	@Operation(summary = "Retrieves all nodes without content")
	@PreAuthorize(HAS_ANY_ROLE)
	public List<TreeNodeRespDTO> listTree() {
		return service.getTree()
				.stream()
				.map(mapper::toTreeNodeRespDTO)
				.toList();
	}

	@GetMapping("/content/{id}")
	@Operation(summary = "Retrieves the content of a node")
	@PreAuthorize(HAS_ANY_ROLE)
	public ContentRespDto getContent(@PathVariable("id") Long id) {
		return new ContentRespDto(
				service.getContentById(id));
	}

	@GetMapping("/search")
	@Operation(summary = "Retrieves all nodes having a substring in name or content, ignoring case")
	@PreAuthorize(HAS_ANY_ROLE)
	public List<Long> findNode(@RequestParam("text") @NotBlank @Size(min = 3) String text) {
		return service.findText(text);
	}

	@PostMapping("/move")
	@Operation(summary = "Moves the given node under the given parent node")
	@PreAuthorize(HAS_MANAGER_ROLE)
	public void moveNode(
			@RequestParam("nodeId") Long nodeId,
			@RequestParam("newParentId") Long newParentId) {
		service.moveNode(nodeId, newParentId);
	}

}
