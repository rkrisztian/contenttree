import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseTreeNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'parent_id', type: 'bigint', nullable: true })
  parentId: number | null;

  /*
   * The following are not needed, because tree traversal happens in native SQL queries.
   * TODO: I need to extend the API to demonstrate the use of relationships in TypeORM.
   *
   *     @ManyToOne('tree_node', (child: T) => child.children, {
   *       eager: false,
   *       onDelete: 'CASCADE',
   *       nullable: true,
   *     })
   *     @JoinColumn({ name: 'parent_id' })
   *     parent: T | null;
   *
   *     @OneToMany('tree_node', (parent: T) => parent.parent, { eager: false, cascade: true })
   *     children: T[];
   */
}

export const isRoot = <T extends BaseTreeNode>(node: T): boolean => node.parentId == null;
