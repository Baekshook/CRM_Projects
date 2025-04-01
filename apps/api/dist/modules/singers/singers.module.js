"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const singers_service_1 = require("./singers.service");
const singers_controller_1 = require("./singers.controller");
const singer_entity_1 = require("./entities/singer.entity");
const files_module_1 = require("../files/files.module");
let SingersModule = class SingersModule {
};
exports.SingersModule = SingersModule;
exports.SingersModule = SingersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([singer_entity_1.Singer]), files_module_1.FilesModule],
        controllers: [singers_controller_1.SingersController],
        providers: [singers_service_1.SingersService],
        exports: [singers_service_1.SingersService],
    })
], SingersModule);
//# sourceMappingURL=singers.module.js.map