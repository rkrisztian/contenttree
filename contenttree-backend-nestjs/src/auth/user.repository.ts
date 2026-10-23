import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './model/user.entity.js';

@Injectable()
export class UserRepository {
  private readonly repo = async () => this.txHost.tx.getRepository(User);

  constructor(private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>) {}

  readonly findByName = async (name: string): Promise<User | null> =>
    (await this.repo()).findOneBy({ name });

  // Only used by an integration test at the moment.
  readonly save = async (user: User) => (await this.repo()).save(user);
}
