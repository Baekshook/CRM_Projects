"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const typeorm_1 = require("typeorm");
let File = class File {
    getFileUrl(baseUrl = "http://localhost:4000/api") {
        return `${baseUrl}/files/${this.id}/data`;
    }
};
exports.File = File;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], File.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], File.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], File.prototype, "originalName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], File.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint"),
    __metadata("design:type", Number)
], File.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], File.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], File.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], File.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "other" }),
    __metadata("design:type", String)
], File.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bytea", nullable: true }),
    __metadata("design:type", Buffer)
], File.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], File.prototype, "isStoredInDb", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "uploaded_at" }),
    __metadata("design:type", Date)
], File.prototype, "uploadedAt", void 0);
__decorate([
    (0, typeorm_1.VersionColumn)({ nullable: true, default: 1 }),
    __metadata("design:type", Number)
], File.prototype, "version", void 0);
exports.File = File = __decorate([
    (0, typeorm_1.Entity)("files")
], File);
//# sourceMappingURL=file.entity.js.map