package contenttree;

import contenttree.dto.ContentRespDto;
import contenttree.dto.CreateTreeNodeReqDTO;
import contenttree.dto.SearchResultsRespDto;
import contenttree.dto.TreeNodeRespDTO;
import contenttree.dto.UpdateTreeNodeReqDTO;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class ContentTreeController {

	private final ContentTreeService service;
	private final ContentTreeMapper mapper;

	public ContentTreeController(ContentTreeService service, ContentTreeMapper mapper) {
		this.service = service;
		this.mapper = mapper;
	}

	@PutMapping
	@Operation(summary = "Creates a new node with the given name and content")
	public TreeNodeRespDTO createNode(@Valid @RequestBody CreateTreeNodeReqDTO dto) {
		return mapper.toTreeNodeRespDTO(
				service.createNode(
						mapper.toTreeNodeWithContent(dto)));
	}

	@PostMapping
	@Operation(summary = "Updates an existing node with the given name and content")
	public TreeNodeRespDTO updateNode(@Valid @RequestBody UpdateTreeNodeReqDTO dto) {
		return mapper.toTreeNodeRespDTO(
				service.updateNode(
						mapper.toTreeNodeWithContent(dto)));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Deletes a node with all children recursively")
	public void deleteNode(@PathVariable("id") Long id) {
		service.deleteNode(id);
	}

	@GetMapping
	@Operation(summary = "Retrieves all nodes without content")
	public List<TreeNodeRespDTO> listTree() {
		return service.getTree()
				.stream()
				.map(mapper::toTreeNodeRespDTO)
				.toList();
	}

	@GetMapping("/content/{id}")
	@Operation(summary = "Retrieves the content of a node")
	public ContentRespDto getContent(@PathVariable("id") Long id) {
		return new ContentRespDto(
				service.getContentById(id));
	}

	@GetMapping("/search")
	@Operation(summary = "Retrieves all nodes having a substring in name or content, ignoring case")
	public SearchResultsRespDto findContent(@RequestParam("text") @NotBlank @Size(min = 3) String text) {
		return new SearchResultsRespDto(
				service.findText(text));
	}

	@PostMapping("/move")
	@Operation(summary = "Moves the given node under the given parent node")
	public void moveNode(
			@RequestParam("nodeId") Long nodeId,
			@RequestParam("newParentId") Long newParentId) {
		service.moveNode(nodeId, newParentId);
	}

}
