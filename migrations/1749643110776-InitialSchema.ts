import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1749643110776 implements MigrationInterface {
  name = 'InitialSchema1749643110776';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`warehouse_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type_name\` varchar(100) NOT NULL, \`description\` text NULL, \`requires_temp_control\` tinyint NOT NULL DEFAULT 0, \`min_temperature_c\` decimal(5,2) NULL, \`max_temperature_c\` decimal(5,2) NULL, UNIQUE INDEX \`IDX_e279553007a9397dcff001c660\` (\`type_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`warehouse\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`location_id\` int NULL, \`warehouse_type_id\` int NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`is_active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_d5d5470e55d4238b1239e9f154\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`location\` (\`id\` int NOT NULL AUTO_INCREMENT, \`address\` varchar(255) NOT NULL, \`city\` varchar(100) NOT NULL, \`state\` varchar(100) NOT NULL, \`zipCode\` varchar(20) NULL, \`note\` text NULL, \`warehouseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`batch\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`serial_number\` varchar(100) NULL, \`lot_number\` varchar(100) NULL, \`production_date\` date NULL, \`expiration_date\` date NULL, \`purchase_price\` decimal(18,4) NULL, \`sale_price\` decimal(18,4) NULL, \`batch_status\` varchar(50) NOT NULL DEFAULT 'Active', \`note\` text NULL, UNIQUE INDEX \`IDX_10eed59e8a130cdb8bdb474016\` (\`serial_number\`), UNIQUE INDEX \`IDX_a8b29272448fd50ee10cd422ec\` (\`lot_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_code\` varchar(50) NOT NULL, \`name\` varchar(255) NOT NULL, \`category_id\` bigint NULL, \`description\` text NULL, \`unit_of_measure\` varchar(10) NOT NULL, \`min_quantity\` decimal(18,4) NULL, \`unit_weight\` decimal(18,4) NULL, \`storage_temp_min\` decimal(5,2) NULL, \`storage_temp_max\` decimal(5,2) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`last_updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fb912a8e66bfe036057ba4651f\` (\`product_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`parent_category_id\` bigint NULL, \`hierarchy_level\` int NOT NULL DEFAULT '1', \`category_type\` varchar(50) NULL, UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`stock_level\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`warehouse_id\` bigint NOT NULL, \`current_quantity\` decimal(18,4) NOT NULL DEFAULT '0.0000', \`reorder_level\` decimal(18,4) NULL, \`reorder_quantity\` decimal(18,4) NULL, \`last_stock_take_date\` date NULL, \`warehouseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`employee\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NULL, \`first_name\` varchar(100) NOT NULL, \`last_name\` varchar(100) NOT NULL, \`position\` varchar(100) NULL, \`employment_date\` date NOT NULL, \`contact_phone\` varchar(20) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_f61258e58ed35475ce1dba0379\` (\`user_id\`), UNIQUE INDEX \`REL_f61258e58ed35475ce1dba0379\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(50) NOT NULL, \`first_name\` varchar(100) NOT NULL, \`last_name\` varchar(100) NOT NULL, \`email\` varchar(255) NULL, \`hashed_password\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`last_login_at\` timestamp NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_role\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`warehouse_access\` (\`id\` int NOT NULL AUTO_INCREMENT, \`employee_id\` int NOT NULL, \`warehouse_id\` int NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`assignment_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`revocation_date\` timestamp NULL, UNIQUE INDEX \`IDX_27c3d6f698a1fbcd719e5c8318\` (\`employee_id\`, \`warehouse_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`supplier\` (\`id\` int NOT NULL AUTO_INCREMENT, \`supplier_name\` varchar(255) NOT NULL, \`location_id\` int NULL, \`contact_person\` varchar(100) NULL, \`phone\` varchar(50) NULL, \`email\` varchar(255) NULL, \`jib\` varchar(50) NULL, \`pdv_number\` varchar(50) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`note\` text NULL, UNIQUE INDEX \`IDX_ddee003931152818b3333ef9f9\` (\`supplier_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`stock_movement\` (\`id\` int NOT NULL AUTO_INCREMENT, \`process_number\` bigint NULL, \`movement_timestamp\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`movement_type\` varchar(50) NOT NULL, \`product_id\` int NOT NULL, \`batch_id\` int NOT NULL, \`quantity\` decimal(18,4) NOT NULL, \`source_warehouse_id\` int NULL, \`destination_warehouse_id\` int NULL, \`employee_id\` int NOT NULL, \`supplier_id\` int NULL, \`reference_document\` varchar(100) NULL, \`note\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse\` ADD CONSTRAINT \`FK_8b5305b2492ac33409546e4aa08\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse\` ADD CONSTRAINT \`FK_2c3c36cd7d11cdcddbe8ba29df9\` FOREIGN KEY (\`warehouse_type_id\`) REFERENCES \`warehouse_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`location\` ADD CONSTRAINT \`FK_4e5ec8325d22f5e6ef552fbfdc2\` FOREIGN KEY (\`warehouseId\`) REFERENCES \`warehouse\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`batch\` ADD CONSTRAINT \`FK_7068e3cdb51a8832e20d2fd26fa\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD CONSTRAINT \`FK_0dce9bc93c2d2c399982d04bef1\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD CONSTRAINT \`FK_d6db2bf1b938f69d2ebac5a9de8\` FOREIGN KEY (\`parent_category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_level\` ADD CONSTRAINT \`FK_dda0d2580ff55ca940846ca2428\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_level\` ADD CONSTRAINT \`FK_9faeb5160da78d9c7291a61bb38\` FOREIGN KEY (\`warehouseId\`) REFERENCES \`warehouse\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` ADD CONSTRAINT \`FK_f61258e58ed35475ce1dba03797\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse_access\` ADD CONSTRAINT \`FK_603713e04e60e9ccebdc8dba3fd\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse_access\` ADD CONSTRAINT \`FK_e8902f4bc7656982129f325f38e\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouse\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier\` ADD CONSTRAINT \`FK_0d65c72ee591e68311badff1a9a\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` ADD CONSTRAINT \`FK_c1bf5ff45511ecaad0b28440e30\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` ADD CONSTRAINT \`FK_89747d54ef90d0a57ca0807235a\` FOREIGN KEY (\`batch_id\`) REFERENCES \`batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` ADD CONSTRAINT \`FK_792c6e36efd3959d9cbe0cfbef7\` FOREIGN KEY (\`source_warehouse_id\`) REFERENCES \`warehouse\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` ADD CONSTRAINT \`FK_bdecf7cb8d6afe28b9675b920ba\` FOREIGN KEY (\`destination_warehouse_id\`) REFERENCES \`warehouse\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` ADD CONSTRAINT \`FK_85b7ff5e0cd68f1ab42c78872f2\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` ADD CONSTRAINT \`FK_2e59cb599edd8588471b296139a\` FOREIGN KEY (\`supplier_id\`) REFERENCES \`supplier\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` DROP FOREIGN KEY \`FK_2e59cb599edd8588471b296139a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` DROP FOREIGN KEY \`FK_85b7ff5e0cd68f1ab42c78872f2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` DROP FOREIGN KEY \`FK_bdecf7cb8d6afe28b9675b920ba\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` DROP FOREIGN KEY \`FK_792c6e36efd3959d9cbe0cfbef7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` DROP FOREIGN KEY \`FK_89747d54ef90d0a57ca0807235a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_movement\` DROP FOREIGN KEY \`FK_c1bf5ff45511ecaad0b28440e30\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier\` DROP FOREIGN KEY \`FK_0d65c72ee591e68311badff1a9a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse_access\` DROP FOREIGN KEY \`FK_e8902f4bc7656982129f325f38e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse_access\` DROP FOREIGN KEY \`FK_603713e04e60e9ccebdc8dba3fd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee\` DROP FOREIGN KEY \`FK_f61258e58ed35475ce1dba03797\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_level\` DROP FOREIGN KEY \`FK_9faeb5160da78d9c7291a61bb38\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`stock_level\` DROP FOREIGN KEY \`FK_dda0d2580ff55ca940846ca2428\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_d6db2bf1b938f69d2ebac5a9de8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_0dce9bc93c2d2c399982d04bef1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`batch\` DROP FOREIGN KEY \`FK_7068e3cdb51a8832e20d2fd26fa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_4e5ec8325d22f5e6ef552fbfdc2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse\` DROP FOREIGN KEY \`FK_2c3c36cd7d11cdcddbe8ba29df9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`warehouse\` DROP FOREIGN KEY \`FK_8b5305b2492ac33409546e4aa08\``,
    );
    await queryRunner.query(`DROP TABLE \`stock_movement\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ddee003931152818b3333ef9f9\` ON \`supplier\``,
    );
    await queryRunner.query(`DROP TABLE \`supplier\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_27c3d6f698a1fbcd719e5c8318\` ON \`warehouse_access\``,
    );
    await queryRunner.query(`DROP TABLE \`warehouse_access\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`REL_f61258e58ed35475ce1dba0379\` ON \`employee\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f61258e58ed35475ce1dba0379\` ON \`employee\``,
    );
    await queryRunner.query(`DROP TABLE \`employee\``);
    await queryRunner.query(`DROP TABLE \`stock_level\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``,
    );
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_fb912a8e66bfe036057ba4651f\` ON \`product\``,
    );
    await queryRunner.query(`DROP TABLE \`product\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a8b29272448fd50ee10cd422ec\` ON \`batch\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_10eed59e8a130cdb8bdb474016\` ON \`batch\``,
    );
    await queryRunner.query(`DROP TABLE \`batch\``);
    await queryRunner.query(`DROP TABLE \`location\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d5d5470e55d4238b1239e9f154\` ON \`warehouse\``,
    );
    await queryRunner.query(`DROP TABLE \`warehouse\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e279553007a9397dcff001c660\` ON \`warehouse_type\``,
    );
    await queryRunner.query(`DROP TABLE \`warehouse_type\``);
  }
}
