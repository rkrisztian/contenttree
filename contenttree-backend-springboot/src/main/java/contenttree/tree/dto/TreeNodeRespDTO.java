package contenttree.tree.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.NOT_REQUIRED;
import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public class TreeNodeRespDTO {

	@Schema(requiredMode = REQUIRED, example = "2")
	private Long id;

	@Schema(requiredMode = REQUIRED, example = "Example node")
	private String name;

	@Schema(requiredMode = NOT_REQUIRED, example = "1")
	private Long parentId;


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

}
