package contenttree.tree.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "tree_node")
public class TreeNode extends BaseTreeNode<TreeNode> {
}
