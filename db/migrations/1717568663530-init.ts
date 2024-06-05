import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1717568663530 implements MigrationInterface {
    name = 'Init1717568663530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."DURs_durcombinationtype_enum" AS ENUM('단일', '복합')`);
        await queryRunner.query(`CREATE TYPE "public"."DURs_contraindicatecombinationtype_enum" AS ENUM('단일', '복합')`);
        await queryRunner.query(`CREATE TABLE "DURs" ("id" integer NOT NULL, "durCombinationType" "public"."DURs_durcombinationtype_enum" NOT NULL, "durCode" character varying(7) NOT NULL, "combinationDUR" character varying(63) NOT NULL, "contraindicateCombinationType" "public"."DURs_contraindicatecombinationtype_enum" NOT NULL, "contraindicateDUR" character varying(7) NOT NULL, "contraindicateCombinationDUR" character varying(63) NOT NULL, "contraindicateReason" character varying(255) NOT NULL, CONSTRAINT "PK_97dc606e6d56a1192c6456aac24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "med-summaries" ("id" integer NOT NULL, CONSTRAINT "PK_5ddd9679c3a217f4d9d00f178bb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "med-summaries"`);
        await queryRunner.query(`DROP TABLE "DURs"`);
        await queryRunner.query(`DROP TYPE "public"."DURs_contraindicatecombinationtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."DURs_durcombinationtype_enum"`);
    }

}
