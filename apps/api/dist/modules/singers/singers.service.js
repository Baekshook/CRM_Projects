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
exports.SingersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const singer_entity_1 = require("./entities/singer.entity");
let SingersService = class SingersService {
    constructor(singersRepository) {
        this.singersRepository = singersRepository;
    }
    async create(createSingerDto) {
        const existingSinger = await this.singersRepository.findOne({
            where: { email: createSingerDto.email },
        });
        if (existingSinger) {
            throw new common_1.ConflictException(`이메일 ${createSingerDto.email}는 이미 등록되어 있습니다.`);
        }
        const singer = this.singersRepository.create(createSingerDto);
        return this.singersRepository.save(singer);
    }
    async findAll() {
        return this.singersRepository.find();
    }
    async findOne(id) {
        const singer = await this.singersRepository.findOne({ where: { id } });
        if (!singer) {
            throw new common_1.NotFoundException(`Singer with ID "${id}" not found`);
        }
        return singer;
    }
    async update(id, updateSingerDto) {
        if (updateSingerDto.email) {
            const existingSinger = await this.singersRepository.findOne({
                where: { email: updateSingerDto.email },
            });
            if (existingSinger && existingSinger.id !== id) {
                throw new common_1.ConflictException(`이메일 ${updateSingerDto.email}는 이미 다른 가수가 사용 중입니다.`);
            }
        }
        const singer = await this.findOne(id);
        Object.assign(singer, updateSingerDto);
        return this.singersRepository.save(singer);
    }
    async remove(id) {
        const result = await this.singersRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Singer with ID "${id}" not found`);
        }
    }
};
exports.SingersService = SingersService;
exports.SingersService = SingersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(singer_entity_1.Singer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SingersService);
//# sourceMappingURL=singers.service.js.map