import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { AppForDocsModule } from './app-for-docs.module.js';
import { configureAppUses, createOpenApiDoc } from './app.config.js';
import { AppModule } from './app.module.js';

const main = async () => {
  if (process.env.GENERATE_OPENAPI_DOCS) {
    await generateOpenApiDocs();
  } else {
    await bootstrap();
  }
};

const bootstrap = async () => {
  const app = (
    await NestFactory.create<NestExpressApplication>(AppModule, {
      bufferLogs: process.env.NODE_ENV !== 'production',
    })
  ).enableShutdownHooks();

  configureAppUses(app);

  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api', app, () => createOpenApiDoc(app));
  }

  app.set('trust proxy', 'loopback');
  await app.listen(process.env.PORT ?? 3001);

  Logger.log(`listening on ${await app.getUrl()}`);
};

async function generateOpenApiDocs() {
  const app = await NestFactory.create(AppForDocsModule, { logger: false });
  const document = createOpenApiDoc(app);
  const outputPath = 'build/openapi.json';

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(document, null, 2));
  console.log(`✓ OpenAPI document written to ${outputPath}`);
  await app.close();
  process.exit(0);
}

await main();
