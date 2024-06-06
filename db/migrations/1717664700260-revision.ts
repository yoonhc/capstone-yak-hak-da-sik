import { MigrationInterface, QueryRunner } from "typeorm";

export class Revision1717664700260 implements MigrationInterface {
    name = 'Revision1717664700260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pills" ("id" integer NOT NULL, "medName" text, "companyName" text, "drugShape" text, "image" text, "colorClass1" text, "colorClass2" text, "lineFront" text, "lineBack" text, "lengLong" double precision, "lengShort" double precision, "thick" double precision, "formCodeName" text, CONSTRAINT "PK_049ae941549e7a3ac88f6e871db" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pills"`);
    }

}
