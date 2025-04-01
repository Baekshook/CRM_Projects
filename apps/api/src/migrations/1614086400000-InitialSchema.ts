import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1614086400000 implements MigrationInterface {
  name = "InitialSchema1614086400000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // version 컬럼이 존재하는지 확인
    const hasVersionColumn = await queryRunner.hasColumn("files", "version");

    if (hasVersionColumn) {
      // version이 null인 레코드들에 기본값 1 설정
      await queryRunner.query(`
        UPDATE files 
        SET version = 1 
        WHERE version IS NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 복구용 로직이 필요하면 여기에 작성
  }
}
