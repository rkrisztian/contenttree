import { QueryRunner } from 'typeorm';

export const up = async (script: string, queryRunner: QueryRunner): Promise<void> =>
  readSqlFile(script).forEach((sqlStatement) => queryRunner.query(sqlStatement));

const readSqlFile = (script: string) =>
  script
    .replace(/\r?\n|\r/g, '\n')
    .split(';\n')
    .filter((query) => query?.length);

export const downNotSupported = () => {
  throw new Error('Not supported by design');
};
