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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const interactions_entity_1 = require("./interactions.entity");
let InteractionsService = class InteractionsService {
    constructor(interactionRepository) {
        this.interactionRepository = interactionRepository;
    }
    async create(createInteractionDto) {
        const interaction = this.interactionRepository.create(createInteractionDto);
        return this.interactionRepository.save(interaction);
    }
    async findAll() {
        return this.interactionRepository.find({
            relations: ["customer"],
        });
    }
    async findByCustomerId(customerId) {
        return this.interactionRepository.find({
            where: { customerId },
            relations: ["customer"],
        });
    }
    async findOne(id) {
        const interaction = await this.interactionRepository.findOne({
            where: { id },
            relations: ["customer"],
        });
        if (!interaction) {
            throw new common_1.NotFoundException(`Interaction with ID "${id}" not found`);
        }
        return interaction;
    }
    async update(id, updateInteractionDto) {
        const interaction = await this.findOne(id);
        Object.assign(interaction, updateInteractionDto);
        return this.interactionRepository.save(interaction);
    }
    async remove(id) {
        const result = await this.interactionRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Interaction with ID "${id}" not found`);
        }
    }
};
exports.InteractionsService = InteractionsService;
exports.InteractionsService = InteractionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(interactions_entity_1.Interaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InteractionsService);
//# sourceMappingURL=interactions.service.js.map