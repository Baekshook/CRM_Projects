import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1709123456789 implements MigrationInterface {
  name = 'InitialSchema1709123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`role\` enum('admin', 'manager', 'staff') NOT NULL DEFAULT 'staff',
                \`isActive\` tinyint NOT NULL DEFAULT 1,
                \`phone\` varchar(20) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

    await queryRunner.query(`
            CREATE TABLE \`customers\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`company\` varchar(255) NULL,
                \`phone\` varchar(20) NULL,
                \`status\` enum('active', 'inactive') NOT NULL DEFAULT 'active',
                \`grade\` enum('일반', 'VIP', 'VVIP') NOT NULL DEFAULT '일반',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

    await queryRunner.query(`
            CREATE TABLE \`requests\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`title\` varchar(255) NOT NULL,
                \`content\` text NOT NULL,
                \`status\` enum('open', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'open',
                \`priority\` enum('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`customerId\` int NULL,
                \`assignedToId\` int NULL,
                PRIMARY KEY (\`id\`),
                KEY \`FK_requests_customer\` (\`customerId\`),
                KEY \`FK_requests_assignedTo\` (\`assignedToId\`),
                CONSTRAINT \`FK_requests_customer\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\` (\`id\`) ON DELETE SET NULL,
                CONSTRAINT \`FK_requests_assignedTo\` FOREIGN KEY (\`assignedToId\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
            ) ENGINE=InnoDB
        `);

    await queryRunner.query(`
            CREATE TABLE \`notifications\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`message\` varchar(255) NOT NULL,
                \`link\` varchar(255) NULL,
                \`isRead\` tinyint NOT NULL DEFAULT 0,
                \`type\` enum('info', 'success', 'warning', 'error') NOT NULL DEFAULT 'info',
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`userId\` int NULL,
                PRIMARY KEY (\`id\`),
                KEY \`FK_notifications_user\` (\`userId\`),
                CONSTRAINT \`FK_notifications_user\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`notifications\``);
    await queryRunner.query(`DROP TABLE \`requests\``);
    await queryRunner.query(`DROP TABLE \`customers\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
