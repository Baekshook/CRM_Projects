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
exports.Singer = void 0;
const typeorm_1 = require("typeorm");
const request_entity_1 = require("../../requests/entities/request.entity");
const match_entity_1 = require("../../matches/entities/match.entity");
const schedule_entity_1 = require("../../schedules/entities/schedule.entity");
const contract_entity_1 = require("../../contracts/entities/contract.entity");
const review_entity_1 = require("../../reviews/entities/review.entity");
let Singer = class Singer {
};
exports.Singer = Singer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Singer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Singer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Singer.prototype, "agency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Singer.prototype, "genre", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Singer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Singer.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Singer.prototype, "profileImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Singer.prototype, "profileImageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Singer.prototype, "statusMessage", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Singer.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", enum: [1, 2, 3, 4, 5], default: 3 }),
    __metadata("design:type", Number)
], Singer.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "float", default: 0 }),
    __metadata("design:type", Number)
], Singer.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["active", "inactive"], default: "active" }),
    __metadata("design:type", String)
], Singer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Singer.prototype, "contractCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Singer.prototype, "lastRequestDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Singer.prototype, "reviewCount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Singer.prototype, "registrationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "가수" }),
    __metadata("design:type", String)
], Singer.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array"),
    __metadata("design:type", Array)
], Singer.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Singer.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Singer.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Singer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Singer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => request_entity_1.Request, (request) => request.singer),
    __metadata("design:type", Array)
], Singer.prototype, "requests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_entity_1.Match, (match) => match.singer),
    __metadata("design:type", Array)
], Singer.prototype, "matches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => schedule_entity_1.Schedule, (schedule) => schedule.singer),
    __metadata("design:type", Array)
], Singer.prototype, "schedules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contract_entity_1.Contract, (contract) => contract.singer),
    __metadata("design:type", Array)
], Singer.prototype, "contracts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.singer),
    __metadata("design:type", Array)
], Singer.prototype, "reviews", void 0);
exports.Singer = Singer = __decorate([
    (0, typeorm_1.Entity)("singers")
], Singer);
//# sourceMappingURL=singer.entity.js.map