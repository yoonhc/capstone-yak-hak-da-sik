import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1717542740643 implements MigrationInterface {
    name = 'Init1717542740643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pills" ("id" integer NOT NULL, "medName" text, "companyName" text, "drugShape" text, "image" text, "colorClass1" text, "colorClass2" text, "lineFront" text, "lineBack" text, "lengLong" double precision, "lengShort" double precision, "thick" double precision, "formCodeName" text, CONSTRAINT "PK_049ae941549e7a3ac88f6e871db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "meds" ("id" integer NOT NULL, "companyName" character varying NOT NULL, "medName" character varying NOT NULL, "effect" text, "howToUse" text, "criticalInfo" text, "warning" text, "interaction" text, "sideEffect" text, "howToStore" text, CONSTRAINT "PK_7924c2c581bc5a988aa38966632" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "meds"`);
        await queryRunner.query(`DROP TABLE "pills"`);
    }

}
