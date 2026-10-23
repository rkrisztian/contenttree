import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { TreeNodeWithContent } from '../model/tree-node-with-content.entity.js';

@Injectable()
export class TreeNodeWithContentRepository {
  private readonly repo = async () => this.txHost.tx.getRepository(TreeNodeWithContent);
  private readonly dataSource = async () => this.txHost.tx.dataSource;

  constructor(private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>) {}

  readonly findOneById = async (id: number) => (await this.repo()).findOneBy({ id });

  readonly existsById = async (id: number) => (await this.repo()).existsBy({ id });

  readonly existsByParentId = async (parentId: number | null): Promise<boolean> => {
    return (await this.repo())
      .createQueryBuilder('tree_node')
      .where(
        parentId == null ? 'tree_node.parent_id IS NULL' : 'tree_node.parent_id = $1',
        parentId == null ? [] : [parentId],
      )
      .getExists();
  };

  readonly findByNameOrContentContainingIgnoreCase = async (substring: string): Promise<number[]> =>
    (
      await (
        await this.dataSource()
      ).query(
        `
      SELECT id
      FROM tree_node
      WHERE LOWER(name) LIKE LOWER($1)
      OR LOWER(content) LIKE LOWER($1)
    `,
        [`%${substring}%`],
      )
    ).map((r: { id: number }) => r.id);

  readonly save = async (node: TreeNodeWithContent) => (await this.repo()).save(node);
}
