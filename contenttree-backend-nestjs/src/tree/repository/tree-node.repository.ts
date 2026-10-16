import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { TreeNode } from '../model/tree-node.entity.js';

@Injectable()
export class TreeNodeRepository {
  private readonly repo = async () => this.txHost.tx.getRepository(TreeNode);

  constructor(private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>) {}

  readonly setParentId = async (nodeId: number, newParentId: number) => {
    await (
      await this.repo()
    ).query(`UPDATE tree_node SET parent_id = $1 WHERE id = $2`, [newParentId, nodeId]);
  };

  readonly deleteByIdRecursively = async (rootId: number): Promise<number> => {
    const query = `
      WITH RECURSIVE descendants AS (
        SELECT id
          FROM tree_node
          WHERE id = $1
        UNION ALL
        SELECT tn.id
          FROM tree_node tn
          INNER JOIN descendants d
          ON tn.parent_id = d.id
      )
      DELETE FROM tree_node WHERE id IN (SELECT id FROM descendants)
    `;
    const { affected } = await (await this.repo()).query(query, [rootId]);
    return affected || 0;
  };

  readonly isDescendant = async (newParentId: number, nodeId: number) => {
    const query = `
      WITH RECURSIVE descendants AS (
        SELECT id
          FROM tree_node
          WHERE id = $2
        UNION ALL
        SELECT tn.id
          FROM tree_node tn
          INNER JOIN descendants d
          ON tn.parent_id = d.id
      )
      SELECT CASE WHEN EXISTS (
        SELECT 1 FROM descendants WHERE id = $1 AND id != $2
      ) THEN 1 ELSE 0 END AS is_desc
    `;
    const [result] = await (await this.repo()).query(query, [newParentId, nodeId]);
    return result.is_desc === 1;
  };

  readonly save = async (node: TreeNode) => (await this.repo()).save(node);

  readonly existsById = async (id: number) => (await this.repo()).existsBy({ id });

  readonly find = async () => (await this.repo()).find();

  readonly findOneById = async (id: number) => (await this.repo()).findOneBy({ id });
}
