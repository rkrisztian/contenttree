package contenttree.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public class ContentRespDto {

	@Schema(requiredMode = REQUIRED, example = "Example content")
	private String data;


	public ContentRespDto(String content) {
		this.data = content;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}
}
