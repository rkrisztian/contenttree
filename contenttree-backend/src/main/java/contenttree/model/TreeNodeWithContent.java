package contenttree.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tree_node")
public class TreeNodeWithContent extends BaseTreeNode<TreeNodeWithContent> {

	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
