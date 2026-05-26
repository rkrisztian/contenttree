--liquibase formatted sql

--changeset rkrisztian:1
--comment Initial changeset for tree_node table
--   NOTE: For recursive tree queries (isDescendant, deleteByIdRecursively) to work with deep
--   hierarchies, the database connection must have 'max_stack_depth' set to a sufficient value.
--   E.g., 5MB is sufficient for trees with a depth of roughly 60-80 levels. Configure this in
--   `application.yaml` under `spring.datasource.hikari.connection-init-sql`. If deep trees are
--   common, consider migrating to a Materialized Path (`path` column) strategy.

CREATE TABLE "public"."tree_node" (
	"id" BIGINT NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"content" TEXT NOT NULL,
	"parent_id" BIGINT NULL,
	CONSTRAINT "tree_node_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "fk_tree_node_parent_id" FOREIGN KEY ("parent_id")
		REFERENCES "public"."tree_node" ("id")
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

CREATE SEQUENCE public.tree_node_seq
	START WITH 1
	INCREMENT BY 50
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;

/*
 * INDEX MANAGEMENT
 * ----------------
 *
 * 1. Parent index for recursive tree traversal (ACTIVE)
 *    - Without it, queries will degrade from O(D×logN) to O(D*N) complexity.
 */
CREATE INDEX idx_tree_node_parent_id ON tree_node(parent_id);

/*
 * 2. Optional B-Tree for 'ORDER BY name' queries (DEFERRED)
 *    - Only create this if the table exceeds 10,000 rows.
 *    - It adds write overhead with no read benefit for small datasets.
 */
-- CREATE INDEX idx_tree_node_name ON tree_node(name);

/*
 * 3. Trigram indices for case-insensitive substring search on name and content
 *    - Prevents reading every single row for large datasets.
 *    - Handles 'LIKE %...%' queries efficiently for lengths >= 3.
 */
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_tree_node_name_trgm_lower ON tree_node USING GIN (LOWER(name) gin_trgm_ops);
CREATE INDEX idx_tree_node_content_trgm_lower ON tree_node USING GIN (LOWER(content) gin_trgm_ops);
