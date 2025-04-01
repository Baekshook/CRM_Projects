"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFileStorageFields1743474877614 = void 0;
class AddFileStorageFields1743474877614 {
    async up(queryRunner) {
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
            await queryRunner.query(`
                CREATE INDEX idx_files_entity ON files (entity_type, entity_id)
            `);
            await queryRunner.query(`
                CREATE INDEX idx_files_category ON files (category)
            `);
        }
        else {
            const columns = await queryRunner.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'files'
            `);
            const columnNames = columns.map((col) => col.column_name);
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
    async down(queryRunner) {
        const tableExists = await queryRunner.hasTable("files");
        if (tableExists) {
            const columns = await queryRunner.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'files'
            `);
            const columnNames = columns.map((col) => col.column_name);
            if (columnNames.includes("is_stored_in_db")) {
                await queryRunner.query(`
                    ALTER TABLE files DROP COLUMN is_stored_in_db
                `);
            }
            if (columnNames.includes("data")) {
                await queryRunner.query(`
                    ALTER TABLE files DROP COLUMN data
                `);
            }
        }
    }
}
exports.AddFileStorageFields1743474877614 = AddFileStorageFields1743474877614;
//# sourceMappingURL=1743474877614-addFileStorageFields.js.map