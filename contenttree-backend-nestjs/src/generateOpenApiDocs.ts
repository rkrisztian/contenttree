import { NestFactory } from '@nestjs/core';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { AppForDocsModule } from './app-for-docs.module.js';
import { createOpenApiDoc } from './app.config.js';

const main = async () => {
  try {
    await generateOpenApiDocs();
  } catch (error) {
    console.error('Failed to generate "openapi.json":', error);
    process.exit(1);
  }
};

async function generateOpenApiDocs() {
  const app = await NestFactory.create(AppForDocsModule, { logger: false });
  const document = createOpenApiDoc(app);
  const outputPath = 'build/openapi.json';

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(document, null, 2));
  console.log(`✓ OpenAPI document written to ${outputPath}`);
  await app.close();
}

await main();
