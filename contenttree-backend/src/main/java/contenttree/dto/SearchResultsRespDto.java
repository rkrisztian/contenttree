package contenttree.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class SearchResultsRespDto {

	@NotNull
	@Schema(example = "[1, 2, 3]")
	private List<Long> ids;


	public SearchResultsRespDto() {
	}

	public SearchResultsRespDto(List<Long> ids) {
		this.ids = ids;
	}

	public List<Long> getIds() {
		return ids;
	}

	public void setIds(List<Long> ids) {
		this.ids = ids;
	}

}
