import { MigrationInterface, QueryRunner } from "typeorm";

export class default1659902444234 implements MigrationInterface {
    name = 'default1659902444234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "cep"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "cep" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "cep"`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD "cep" numeric`);
    }

}
