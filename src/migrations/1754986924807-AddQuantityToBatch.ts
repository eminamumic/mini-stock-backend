import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuantityToBatch1754986924807 implements MigrationInterface {
    name = 'AddQuantityToBatch1754986924807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`batch\` ADD \`quantity\` decimal(18,4) NOT NULL DEFAULT '0.0000'`);
        await queryRunner.query(`ALTER TABLE \`stock_movement\` CHANGE \`reference_document\` \`reference_document\` varchar(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`stock_movement\` CHANGE \`reference_document\` \`reference_document\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP COLUMN \`quantity\``);
    }

}
