import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1716469079824 implements MigrationInterface {
    name = 'Init1716469079824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pills" ADD "medName" text`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "drugShape" text`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "colorClass1" text`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "colorClass2" text`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "lineFront" text`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "lineBack" text`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "lengLong" text`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "lengShort" text`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "thick" text`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "formCodeName" text`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "effect" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "howToUse" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "criticalInfo" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "warning" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "interaction" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "sideEffect" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "howToStore" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "howToStore" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "sideEffect" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "interaction" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "warning" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "criticalInfo" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "howToUse" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meds" ALTER COLUMN "effect" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "formCodeName"`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "thick"`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "lengShort"`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "lengLong"`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "lineBack"`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "lineFront"`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "colorClass2"`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "colorClass1"`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "drugShape"`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "medName"`);
    }

}
