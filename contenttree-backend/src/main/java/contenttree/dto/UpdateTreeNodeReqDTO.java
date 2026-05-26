package contenttree.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateTreeNodeReqDTO {

	@NotNull
	@Schema(example = "1")
	private Long id;

	@NotNull
	@NotBlank
	@Schema(example = "Example node")
	private String name;

	@NotNull
	@Schema(example = "Example content")
	private String content;

	public UpdateTreeNodeReqDTO() {
	}

	public UpdateTreeNodeReqDTO(Long id, String name, String content) {
		this.id = id;
		this.name = name;
		this.content = content;
	}

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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
