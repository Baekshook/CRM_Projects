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
exports.Match = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("../../customers/entities/customer.entity");
const singer_entity_1 = require("../../singers/entities/singer.entity");
const request_entity_1 = require("../../requests/entities/request.entity");
const schedule_entity_1 = require("../../schedules/entities/schedule.entity");
const contract_entity_1 = require("../../contracts/entities/contract.entity");
const negotiation_log_entity_1 = require("../../negotiations/entities/negotiation-log.entity");
let Match = class Match {
};
exports.Match = Match;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Match.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "requestTitle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "customerCompany", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "singerId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "singerName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "singerAgency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "eventDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["pending", "negotiating", "confirmed", "cancelled"],
        default: "pending",
    }),
    __metadata("design:type", String)
], Match.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Match.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Match.prototype, "requirements", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { nullable: true }),
    __metadata("design:type", String)
], Match.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Match.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Match.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Match.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.Request, (request) => request.matches),
    (0, typeorm_1.JoinColumn)({ name: "requestId" }),
    __metadata("design:type", request_entity_1.Request)
], Match.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.matches),
    (0, typeorm_1.JoinColumn)({ name: "customerId" }),
    __metadata("design:type", customer_entity_1.Customer)
], Match.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => singer_entity_1.Singer, (singer) => singer.matches),
    (0, typeorm_1.JoinColumn)({ name: "singerId" }),
    __metadata("design:type", singer_entity_1.Singer)
], Match.prototype, "singer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => schedule_entity_1.Schedule, (schedule) => schedule.match),
    __metadata("design:type", Array)
], Match.prototype, "schedules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contract_entity_1.Contract, (contract) => contract.match),
    __metadata("design:type", Array)
], Match.prototype, "contracts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => negotiation_log_entity_1.NegotiationLog, (negotiationLog) => negotiationLog.match),
    __metadata("design:type", Array)
], Match.prototype, "negotiationLogs", void 0);
exports.Match = Match = __decorate([
    (0, typeorm_1.Entity)("matches")
], Match);
//# sourceMappingURL=match.entity.js.map