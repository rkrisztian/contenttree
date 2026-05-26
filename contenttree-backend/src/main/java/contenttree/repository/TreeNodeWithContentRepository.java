package contenttree.repository;

import contenttree.model.TreeNodeWithContent;
import org.jspecify.annotations.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TreeNodeWithContentRepository extends JpaRepository<TreeNodeWithContent, Long> {

	boolean existsByParentId(@Nullable Long parentId);

	@Query(value = """
			SELECT id
			FROM tree_node
			WHERE LOWER(name) LIKE LOWER(CONCAT('%', :substring, '%'))
				OR LOWER(content) LIKE LOWER(CONCAT('%', :substring, '%'))
			""", nativeQuery = true)
	List<Long> findByNameOrContentContainingIgnoreCase(@Param("substring") String substring);

}
