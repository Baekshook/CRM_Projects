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
exports.NegotiationLog = void 0;
const typeorm_1 = require("typeorm");
const match_entity_1 = require("../../matches/entities/match.entity");
const negotiation_entity_1 = require("./negotiation.entity");
let NegotiationLog = class NegotiationLog {
};
exports.NegotiationLog = NegotiationLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], NegotiationLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NegotiationLog.prototype, "matchId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NegotiationLog.prototype, "negotiationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NegotiationLog.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NegotiationLog.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], NegotiationLog.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NegotiationLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], NegotiationLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => match_entity_1.Match, (match) => match.negotiationLogs, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: "matchId" }),
    __metadata("design:type", match_entity_1.Match)
], NegotiationLog.prototype, "match", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => negotiation_entity_1.Negotiation, (negotiation) => negotiation.logs),
    (0, typeorm_1.JoinColumn)({ name: "negotiationId" }),
    __metadata("design:type", negotiation_entity_1.Negotiation)
], NegotiationLog.prototype, "negotiation", void 0);
exports.NegotiationLog = NegotiationLog = __decorate([
    (0, typeorm_1.Entity)("negotiation_logs")
], NegotiationLog);
//# sourceMappingURL=negotiation-log.entity.js.map