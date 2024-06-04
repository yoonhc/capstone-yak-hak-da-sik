import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1717510854977 implements MigrationInterface {
    name = 'Migrations1717510854977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pills" ("id" integer NOT NULL, "medName" text, "companyName" text, "drugShape" text, "image" text, "colorClass1" text, "colorClass2" text, "lineFront" text, "lineBack" text, "lengLong" double precision, "lengShort" double precision, "thick" double precision, "formCodeName" text, CONSTRAINT "PK_049ae941549e7a3ac88f6e871db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "meds" ("id" integer NOT NULL, "companyName" character varying NOT NULL, "medName" character varying NOT NULL, "effect" text, "howToUse" text, "criticalInfo" text, "warning" text, "interaction" text, "sideEffect" text, "howToStore" text, CONSTRAINT "PK_7924c2c581bc5a988aa38966632" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."med-refs_medtype_enum" AS ENUM('전문의약품', '일반의약품')`);
        await queryRunner.query(`CREATE TABLE "med-refs" ("id" integer NOT NULL, "medName" character varying(255) NOT NULL, "companyName" character varying(255) NOT NULL, "medType" "public"."med-refs_medtype_enum" NOT NULL, "image" character varying(255), "medClass" character varying(255) NOT NULL, "dur" character varying, CONSTRAINT "PK_ecf211399b4a0ef08bc7dd96534" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "med-refs"`);
        await queryRunner.query(`DROP TYPE "public"."med-refs_medtype_enum"`);
        await queryRunner.query(`DROP TABLE "meds"`);
        await queryRunner.query(`DROP TABLE "pills"`);
    }

}
