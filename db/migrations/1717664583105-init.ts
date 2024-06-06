import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1717664583105 implements MigrationInterface {
    name = 'Init1717664583105'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scraped-meds" ("id" integer NOT NULL, "effect" text, "howToUse" text, "warning" text, "howToStore" character varying(127), CONSTRAINT "PK_925f3a7dee69c679512d037c24a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "meds" ("id" integer NOT NULL, "companyName" character varying NOT NULL, "medName" character varying NOT NULL, "effect" text, "howToUse" text, "criticalInfo" text, "warning" text, "interaction" text, "sideEffect" text, "howToStore" text, CONSTRAINT "PK_7924c2c581bc5a988aa38966632" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."med-refs_medtype_enum" AS ENUM('전문의약품', '일반의약품')`);
        await queryRunner.query(`CREATE TABLE "med-refs" ("id" integer NOT NULL, "medName" character varying(255) NOT NULL, "companyName" character varying(255) NOT NULL, "medType" "public"."med-refs_medtype_enum" NOT NULL, "image" character varying(255), "medClass" character varying(255) NOT NULL, "contraindicateDUR" character varying, "durCombined" character varying, CONSTRAINT "PK_ecf211399b4a0ef08bc7dd96534" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "med-summaries" ("id" integer NOT NULL, "effect" text, "pillCheck" text, "medInteraction" text, "underlyingConditionWarn" text, "genaralWarn" text, "pregnancyWarn" text, "foodInteraction" text, "suppInteraction" text, CONSTRAINT "PK_5ddd9679c3a217f4d9d00f178bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."DURs_durcombinationtype_enum" AS ENUM('단일', '복합')`);
        await queryRunner.query(`CREATE TYPE "public"."DURs_contraindicatecombinationtype_enum" AS ENUM('단일', '복합')`);
        await queryRunner.query(`CREATE TABLE "DURs" ("id" integer NOT NULL, "durCombinationType" "public"."DURs_durcombinationtype_enum" NOT NULL, "durCode" character varying(7) NOT NULL, "combinationDUR" character varying(63), "contraindicateCombinationType" "public"."DURs_contraindicatecombinationtype_enum", "contraindicateDUR" character varying(7) NOT NULL, "contraindicateCombinationDUR" character varying(63), "contraindicateReason" character varying(255), CONSTRAINT "PK_97dc606e6d56a1192c6456aac24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "companyName" text`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "image" text`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "lengLong"`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "lengLong" double precision`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "lengShort"`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "lengShort" double precision`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "thick"`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "thick" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "thick"`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "thick" text`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "lengShort"`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "lengShort" text`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "lengLong"`);
        await queryRunner.query(`ALTER TABLE "pills" ADD "lengLong" text`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "pills" DROP COLUMN "companyName"`);
        await queryRunner.query(`DROP TABLE "DURs"`);
        await queryRunner.query(`DROP TYPE "public"."DURs_contraindicatecombinationtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."DURs_durcombinationtype_enum"`);
        await queryRunner.query(`DROP TABLE "med-summaries"`);
        await queryRunner.query(`DROP TABLE "med-refs"`);
        await queryRunner.query(`DROP TYPE "public"."med-refs_medtype_enum"`);
        await queryRunner.query(`DROP TABLE "meds"`);
        await queryRunner.query(`DROP TABLE "scraped-meds"`);
    }

}
