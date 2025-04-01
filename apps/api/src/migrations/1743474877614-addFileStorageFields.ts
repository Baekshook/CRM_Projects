import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileStorageFields1743474877614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // files 테이블이 존재하는지 확인 후 없으면 생성
    const tableExists = await queryRunner.hasTable("files");

    if (!tableExists) {
      await queryRunner.query(`
                CREATE TABLE files (
                    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                    filename VARCHAR NOT NULL,
                    original_name VARCHAR NOT NULL,
                    mime_type VARCHAR NOT NULL,
                    size BIGINT NOT NULL,
                    path VARCHAR,
                    entity_type VARCHAR NOT NULL,
                    entity_id VARCHAR NOT NULL,
                    category VARCHAR,
                    data BYTEA,
                    uploaded_at TIMESTAMP DEFAULT now(),
                    is_stored_in_db BOOLEAN DEFAULT false
                )
            `);

      // 인덱스 생성
      await queryRunner.query(`
                CREATE INDEX idx_files_entity ON files (entity_type, entity_id)
            `);

      await queryRunner.query(`
                CREATE INDEX idx_files_category ON files (category)
            `);
    } else {
      // 테이블이 존재하면 부족한 컬럼만 추가
      const columns = await queryRunner.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'files'
            `);
      const columnNames = columns.map((col: any) => col.column_name);

      if (!columnNames.includes("data")) {
        await queryRunner.query(`
                    ALTER TABLE files ADD COLUMN data BYTEA
                `);
      }

      if (!columnNames.includes("is_stored_in_db")) {
        await queryRunner.query(`
                    ALTER TABLE files ADD COLUMN is_stored_in_db BOOLEAN DEFAULT false
                `);
      }

      if (!columnNames.includes("uploaded_at")) {
        await queryRunner.query(`
                    ALTER TABLE files ADD COLUMN uploaded_at TIMESTAMP DEFAULT now()
                `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 테이블이 존재하는 경우에만 컬럼 삭제
    const tableExists = await queryRunner.hasTable("files");

    if (tableExists) {
      // 컬럼이 존재하는지 확인 후 삭제
      const columns = await queryRunner.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'files'
            `);
      const columnNames = columns.map((col: any) => col.column_name);

      if (columnNames.includes("is_stored_in_db")) {
        await queryRunner.query(`
                    ALTER TABLE files DROP COLUMN is_stored_in_db
                `);
      }

      // data 컬럼은 필요한 경우에만 삭제
      if (columnNames.includes("data")) {
        await queryRunner.query(`
                    ALTER TABLE files DROP COLUMN data
                `);
      }
    }
  }
}
