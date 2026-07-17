package contenttree.tree.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateTreeNodeReqDTO {

	@NotNull
	@NotBlank
	@Schema(example = "Example node")
	private String name;

	@NotNull
	@Schema(example = "Example content")
	private String content;

	@Schema(example = "1")
	private Long parentId;

	public CreateTreeNodeReqDTO() {
	}

	public CreateTreeNodeReqDTO(String name, String content, Long parentId) {
		this.name = name;
		this.content = content;
		this.parentId = parentId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

}
