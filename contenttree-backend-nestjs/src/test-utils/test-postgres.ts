import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DynamicModule, INestApplication, Provider, Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles/roles.guard.js';
import { AllExceptionsFilter } from '../common/exception-handler/all-exceptions.filter.js';
import { Migration001Init20261015090000 } from '../migrations/001_init.js';

const TEST_DB_NAME = 'test-db';
const TEST_DB_USERNAME = 'postgres';
const TEST_DB_PASSWORD = 'secret';

let postgres: StartedPostgreSqlContainer;
let app: INestApplication | null;

export const startTestDatabase = async () => {
  postgres = await new PostgreSqlContainer(process.env.POSTGRES_IMAGE!)
    .withDatabase(TEST_DB_NAME)
    .withUsername(TEST_DB_USERNAME)
    .withPassword(TEST_DB_PASSWORD)
    .withCommand(['-c', 'fsync=off'])
    // TODO: Make container reusable
    //.withReuse()
    .start();
};

export const stopTestDatabase = async () => postgres.stop();

export const resetTestDatabase = async () => {
  if (!app) {
    return;
  }

  const dataSource = app.get(DataSource);

  await Promise.all(
    dataSource.entityMetadatas.map((entity) =>
      dataSource.query(`TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE`),
    ),
  );
};

export const createTestApp = async ({
  modules,
  entities,
  controllers,
  providers,
}: {
  modules?: (DynamicModule | Promise<DynamicModule>)[];
  entities: Function[];
  controllers: Type<any>[];
  providers: Provider[];
}) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: postgres.getMappedPort(5432),
        username: TEST_DB_USERNAME,
        password: TEST_DB_PASSWORD,
        database: TEST_DB_NAME,
        entities,
        // TODO: load migrations dynamically
        migrations: [Migration001Init20261015090000],
        migrationsRun: true,
        synchronize: false,
        logging: ['error', 'warn'],
        parseInt8: true,
      }),
      ClsModule.forRoot({
        global: true,
        middleware: { mount: true },
        plugins: [
          new ClsPluginTransactional({
            imports: [TypeOrmModule],
            adapter: new TransactionalAdapterTypeOrm({
              dataSourceToken: DataSource,
            }),
          }),
        ],
      }),
      ...(modules ?? []),
    ],
    controllers,
    providers,
  })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true })
    .compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.init();
};

export const getTestApp = () => {
  if (!app) {
    throw new Error('Function `createTestApp` was not called');
  }

  return app;
};

export const destroyTestApp = async () => {
  await app!.close();
  app = null;
};
