import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldAvatarToUserTable1723628636127 implements MigrationInterface {
    name = 'AddFieldAvatarToUserTable1723628636127'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
