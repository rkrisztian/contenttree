import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import path from 'node:path';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module.js';
import { TracingModule } from './common/tracing/tracing.module.js';
import { HealthController } from './health.controller.js';
import { TreeModule } from './tree/tree.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow('DB_HOST'),
        port: 5432,
        username: config.getOrThrow('DB_USERNAME'),
        password: config.getOrThrow('DB_PASSWORD'),
        database: config.getOrThrow('DB_NAME'),
        entities: [path.join('dist', '**', '*.entity.js')],
        migrations: [path.join('dist', 'migrations', '*.js')],
        migrationsRun: true,
        synchronize: false,
        logging:
          process.env.NODE_ENV === 'production'
            ? ['error', 'warn', 'log']
            : ['error', 'warn', 'log', 'query'],
        parseInt8: true,
      }),
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
    TreeModule,
    AuthModule,
    TracingModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
