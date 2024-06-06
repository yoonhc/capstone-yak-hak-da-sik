import { MigrationInterface, QueryRunner } from "typeorm";

export class Revision31717652761227 implements MigrationInterface {
    name = 'Revision31717652761227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "med-refs" ("id" integer NOT NULL, "medName" character varying(255) NOT NULL, "companyName" character varying(255) NOT NULL, "medType" "public"."med-refs_medtype_enum" NOT NULL, "image" character varying(255), "medClass" character varying(255) NOT NULL, "contraindicateDUR" character varying, "durCombined" character varying, CONSTRAINT "PK_ecf211399b4a0ef08bc7dd96534" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "med-summaries" ADD "effect" text`);
        await queryRunner.query(`ALTER TABLE "med-summaries" ADD "pillCheck" text`);
        await queryRunner.query(`ALTER TABLE "med-summaries" ADD "medInteraction" text`);
        await queryRunner.query(`ALTER TABLE "med-summaries" ADD "underlyingConditionWarn" text`);
        await queryRunner.query(`ALTER TABLE "med-summaries" ADD "genaralWarn" text`);
        await queryRunner.query(`ALTER TABLE "med-summaries" ADD "regnancyWarn" text`);
        await queryRunner.query(`ALTER TABLE "med-summaries" ADD "foodInteraction" text`);
        await queryRunner.query(`ALTER TABLE "med-summaries" ADD "suppInteraction" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "med-summaries" DROP COLUMN "suppInteraction"`);
        await queryRunner.query(`ALTER TABLE "med-summaries" DROP COLUMN "foodInteraction"`);
        await queryRunner.query(`ALTER TABLE "med-summaries" DROP COLUMN "regnancyWarn"`);
        await queryRunner.query(`ALTER TABLE "med-summaries" DROP COLUMN "genaralWarn"`);
        await queryRunner.query(`ALTER TABLE "med-summaries" DROP COLUMN "underlyingConditionWarn"`);
        await queryRunner.query(`ALTER TABLE "med-summaries" DROP COLUMN "medInteraction"`);
        await queryRunner.query(`ALTER TABLE "med-summaries" DROP COLUMN "pillCheck"`);
        await queryRunner.query(`ALTER TABLE "med-summaries" DROP COLUMN "effect"`);
        await queryRunner.query(`DROP TABLE "med-refs"`);
    }

}
