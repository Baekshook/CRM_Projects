"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1614086400000 = void 0;
class InitialSchema1614086400000 {
    constructor() {
        this.name = "InitialSchema1614086400000";
    }
    async up(queryRunner) {
        const hasVersionColumn = await queryRunner.hasColumn("files", "version");
        if (hasVersionColumn) {
            await queryRunner.query(`
        UPDATE files 
        SET version = 1 
        WHERE version IS NULL
      `);
        }
    }
    async down(queryRunner) {
    }
}
exports.InitialSchema1614086400000 = InitialSchema1614086400000;
//# sourceMappingURL=1614086400000-InitialSchema.js.map