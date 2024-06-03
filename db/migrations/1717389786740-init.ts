import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1717389786740 implements MigrationInterface {
    name = 'Init1717389786740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "med-refs" ("id" integer NOT NULL, "medName" character varying(255) NOT NULL, "companyName" character varying(255) NOT NULL, "medType" "public"."med-refs_medtype_enum" NOT NULL, "image" character varying(255), "medClass" character varying(255) NOT NULL, "dur" character varying, CONSTRAINT "PK_ecf211399b4a0ef08bc7dd96534" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "med-refs"`);
    }

}
