package contenttree.tree;

import contenttree.tree.dto.CreateTreeNodeReqDTO;
import contenttree.tree.dto.TreeNodeRespDTO;
import contenttree.tree.dto.UpdateTreeNodeReqDTO;
import contenttree.tree.model.TreeNode;
import contenttree.tree.model.TreeNodeWithContent;
import org.jspecify.annotations.Nullable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ContentTreeMapper {

	@Mapping(target = "id", ignore = true)
	@Mapping(source = "parentId", target = "parent", qualifiedByName = "mapParent")
	@Mapping(target = "children", ignore = true)
	TreeNodeWithContent toTreeNodeWithContent(CreateTreeNodeReqDTO dto);

	@Mapping(target = "parent", ignore = true)
	@Mapping(target = "children", ignore = true)
	TreeNodeWithContent toTreeNodeWithContent(UpdateTreeNodeReqDTO dto);

	@Mapping(source = "parent.id", target = "parentId")
	TreeNodeRespDTO toTreeNodeRespDTO(TreeNode node);

	@Named("mapParent")
	default @Nullable TreeNodeWithContent mapParent(@Nullable Long parentId) {
		if (parentId == null) {
			return null;
		}

		final TreeNodeWithContent parent = new TreeNodeWithContent();
		parent.setId(parentId);
		return parent;
	}

}
