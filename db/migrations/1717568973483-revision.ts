import { MigrationInterface, QueryRunner } from "typeorm";

export class Revision1717568973483 implements MigrationInterface {
    name = 'Revision1717568973483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "DURs" ALTER COLUMN "combinationDUR" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "DURs" ALTER COLUMN "contraindicateCombinationType" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "DURs" ALTER COLUMN "contraindicateCombinationDUR" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "DURs" ALTER COLUMN "contraindicateReason" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "DURs" ALTER COLUMN "contraindicateReason" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "DURs" ALTER COLUMN "contraindicateCombinationDUR" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "DURs" ALTER COLUMN "contraindicateCombinationType" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "DURs" ALTER COLUMN "combinationDUR" SET NOT NULL`);
    }

}
