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
exports.Contract = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("../../customers/entities/customer.entity");
const singer_entity_1 = require("../../singers/entities/singer.entity");
const request_entity_1 = require("../../requests/entities/request.entity");
const match_entity_1 = require("../../matches/entities/match.entity");
const schedule_entity_1 = require("../../schedules/entities/schedule.entity");
const payment_entity_1 = require("../../payments/entities/payment.entity");
const review_entity_1 = require("../../reviews/entities/review.entity");
let Contract = class Contract {
};
exports.Contract = Contract;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Contract.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "matchId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "scheduleId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "requestId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "customerName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "customerCompany", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "singerId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "singerName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "singerAgency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "eventTitle", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "eventDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "contractAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["unpaid", "partial", "paid"],
        default: "unpaid",
    }),
    __metadata("design:type", String)
], Contract.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["draft", "sent", "signed", "completed", "cancelled"],
        default: "draft",
    }),
    __metadata("design:type", String)
], Contract.prototype, "contractStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Contract.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contract.prototype, "signedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Contract.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.contracts),
    (0, typeorm_1.JoinColumn)({ name: "customerId" }),
    __metadata("design:type", customer_entity_1.Customer)
], Contract.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => singer_entity_1.Singer, (singer) => singer.contracts),
    (0, typeorm_1.JoinColumn)({ name: "singerId" }),
    __metadata("design:type", singer_entity_1.Singer)
], Contract.prototype, "singer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => request_entity_1.Request, (request) => request.contracts),
    (0, typeorm_1.JoinColumn)({ name: "requestId" }),
    __metadata("design:type", request_entity_1.Request)
], Contract.prototype, "request", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => match_entity_1.Match, (match) => match.contracts),
    (0, typeorm_1.JoinColumn)({ name: "matchId" }),
    __metadata("design:type", match_entity_1.Match)
], Contract.prototype, "match", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => schedule_entity_1.Schedule, (schedule) => schedule.contracts),
    (0, typeorm_1.JoinColumn)({ name: "scheduleId" }),
    __metadata("design:type", schedule_entity_1.Schedule)
], Contract.prototype, "schedule", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.contract),
    __metadata("design:type", Array)
], Contract.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.contract),
    __metadata("design:type", Array)
], Contract.prototype, "reviews", void 0);
exports.Contract = Contract = __decorate([
    (0, typeorm_1.Entity)("contracts")
], Contract);
//# sourceMappingURL=contract.entity.js.map