import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestApp, getTestApp } from '../test-utils/test-postgres.js';
import { SqlInitService } from './sql-init.service.js';

describe('SqlInitService', () => {
  beforeEach(async () => {
    await createTestApp({
      metadata: {
        providers: [
          SqlInitService,
          {
            provide: ConfigService,
            useValue: {
              get: vi.fn((key: string) => {
                if (key === 'SQL_INIT_LOCATION') {
                  return new URL('../test-utils/test-init.sql', import.meta.url).pathname;
                }
                throw new Error(`Unexpected config key: ${key}`);
              }),
            },
          },
        ],
      },
    });
  });

  describe('onApplicationBootstrap', () => {
    it('should execute SQL init file when SQL_INIT_LOCATION is configured', async () => {
      const service = getTestApp().get(SqlInitService);

      await expect(service.onApplicationBootstrap()).resolves.not.toThrow();
    });

    it('should not throw when SQL_INIT_LOCATION is not configured', async () => {
      const service = getTestApp().get(SqlInitService);
      const configService = getTestApp().get(ConfigService);

      vi.mocked(configService.get).mockReturnValue(undefined);

      await expect(service.onApplicationBootstrap()).resolves.not.toThrow();
    });

    it('should throw when SQL file cannot be read', async () => {
      const service = getTestApp().get(SqlInitService);
      const configService = getTestApp().get(ConfigService);

      vi.mocked(configService.get).mockReturnValue('/invalid/path/that/does/not/exist.sql');

      await expect(service.onApplicationBootstrap()).rejects.toThrow('Cannot read SQL init file');
    });

    it('should execute SQL within a transaction with advisory lock', async () => {
      const service = getTestApp().get(SqlInitService);
      const dataSource = getTestApp().get(DataSource);

      const transactionMock = vi.spyOn(dataSource, 'transaction');

      await service.onApplicationBootstrap();

      expect(transactionMock).toHaveBeenCalled();
      expect(transactionMock).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should handle SQL execution errors properly', async () => {
      const service = getTestApp().get(SqlInitService);
      const dataSource = getTestApp().get(DataSource);

      vi.spyOn(dataSource, 'transaction').mockRejectedValue(new Error('SQL execution failed'));

      await expect(service.onApplicationBootstrap()).rejects.toThrow('SQL execution failed');
    });
  });
});
