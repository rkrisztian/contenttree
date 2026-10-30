import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { readFile } from 'node:fs/promises';
import { DataSource } from 'typeorm';

@Injectable()
export class SqlInitService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SqlInitService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const path = this.config.get<string>('SQL_INIT_LOCATION');
    if (!path) return;

    let sql: string;
    try {
      sql = await readFile(path, 'utf-8');
    } catch (cause) {
      throw new Error(`Cannot read SQL init file at ${path}`, { cause });
    }

    await this.dataSource.transaction(async (manager) => {
      // Advisory lock: serializes this across replicas.
      await manager.query('SELECT pg_advisory_xact_lock(727001)');
      await manager.query(sql);
    });

    this.logger.log(`Applied init SQL from ${path}`);
  }
}
