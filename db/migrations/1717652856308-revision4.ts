import { MigrationInterface, QueryRunner } from "typeorm";

export class Revision41717652856308 implements MigrationInterface {
    name = 'Revision41717652856308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "med-summaries" RENAME COLUMN "regnancyWarn" TO "pregnancyWarn"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "med-summaries" RENAME COLUMN "pregnancyWarn" TO "regnancyWarn"`);
    }

}
