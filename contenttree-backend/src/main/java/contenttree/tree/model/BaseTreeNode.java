package contenttree.tree.model;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;

import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.CascadeType.ALL;
import static jakarta.persistence.FetchType.LAZY;

@MappedSuperclass
public class BaseTreeNode<T extends BaseTreeNode<T>> {

	@Id
	@GeneratedValue
	private Long id;

	@Column(nullable = false)
	private String name;

	@ManyToOne(fetch = LAZY)
	private T parent;

	@OneToMany(mappedBy = "parent", cascade = ALL, fetch = LAZY)
	private List<T> children = new ArrayList<>();

	public boolean isRoot() {
		return parent == null;
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

	public T getParent() {
		return parent;
	}

	public void setParent(T parent) {
		this.parent = parent;
	}

	public List<T> getChildren() {
		return children;
	}

	public void setChildren(List<T> children) {
		this.children = children;
	}

	@Override
	public final boolean equals(Object o) {
		if (!(o instanceof BaseTreeNode<?> that)) return false;
		return id.equals(that.id);
	}

	@Override
	public int hashCode() {
		return id.hashCode();
	}

}
