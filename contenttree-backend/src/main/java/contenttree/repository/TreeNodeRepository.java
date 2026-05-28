package contenttree.repository;

import contenttree.model.TreeNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface TreeNodeRepository extends JpaRepository<TreeNode, Long> {

	@SuppressWarnings("java:S2479")  // Not an issue for SQL text blocks
	@Modifying
	@Transactional
	@Query(value = """
			WITH RECURSIVE descendants AS (
			    SELECT id
			    	FROM tree_node
				    WHERE id = :rootId
			    UNION ALL
			    SELECT tn.id
			    	FROM tree_node tn
				    INNER JOIN descendants d
				    ON tn.parent_id = d.id
			)
			DELETE FROM tree_node WHERE id IN (SELECT id FROM descendants)
			""", nativeQuery = true)
	void deleteByIdRecursively(@Param("rootId") Long rootId);

	/**
	 * Determines whether the node with ID {@code newParentId} is a descendant of that with ID
	 * {@code nodeId}.
	 */
	@SuppressWarnings("java:S2479")  // Not an issue for SQL text blocks
	@Query(value = """
			WITH RECURSIVE descendants AS (
			    SELECT id
			    	FROM tree_node
			        WHERE id = :nodeId
			    UNION ALL
			    SELECT tn.id
			        FROM tree_node tn
			        INNER JOIN descendants d
			        ON tn.parent_id = d.id
			)
			SELECT CASE WHEN EXISTS (
			    SELECT 1 FROM descendants WHERE id = :newParentId AND id != :nodeId
			) THEN true ELSE false END
			""", nativeQuery = true)
	boolean isDescendant(@Param("newParentId") Long newParentId, @Param("nodeId") Long nodeId);

}
