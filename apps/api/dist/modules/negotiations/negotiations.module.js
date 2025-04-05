"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegotiationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const negotiation_log_entity_1 = require("./entities/negotiation-log.entity");
const negotiation_entity_1 = require("./entities/negotiation.entity");
const quote_entity_1 = require("./entities/quote.entity");
const negotiations_controller_1 = require("./negotiations.controller");
const negotiations_service_1 = require("./negotiations.service");
let NegotiationsModule = class NegotiationsModule {
};
exports.NegotiationsModule = NegotiationsModule;
exports.NegotiationsModule = NegotiationsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([negotiation_log_entity_1.NegotiationLog, negotiation_entity_1.Negotiation, quote_entity_1.Quote])],
        controllers: [negotiations_controller_1.NegotiationsController],
        providers: [negotiations_service_1.NegotiationsService],
        exports: [negotiations_service_1.NegotiationsService],
    })
], NegotiationsModule);
//# sourceMappingURL=negotiations.module.js.map