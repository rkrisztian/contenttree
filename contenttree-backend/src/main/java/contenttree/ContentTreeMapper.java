package contenttree;

import contenttree.dto.CreateTreeNodeReqDTO;
import contenttree.dto.TreeNodeRespDTO;
import contenttree.dto.UpdateTreeNodeReqDTO;
import contenttree.model.TreeNode;
import contenttree.model.TreeNodeWithContent;
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

	@Mapping(source = "parent.id", target = "parentId")
	TreeNodeRespDTO toTreeNodeRespDTO(TreeNodeWithContent node);

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
