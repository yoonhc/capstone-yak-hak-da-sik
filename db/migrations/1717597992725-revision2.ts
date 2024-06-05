import { MigrationInterface, QueryRunner } from "typeorm";

export class Revision21717597992725 implements MigrationInterface {
    name = 'Revision21717597992725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scraped-meds" ("id" integer NOT NULL, "effect" text, "howToUse" text, "warning" text, "howToStore" character varying(127), CONSTRAINT "PK_925f3a7dee69c679512d037c24a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "scraped-meds"`);
    }

}
