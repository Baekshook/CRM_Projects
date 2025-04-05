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
exports.SegmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const segments_entity_1 = require("./segments.entity");
let SegmentsService = class SegmentsService {
    constructor(segmentRepository) {
        this.segmentRepository = segmentRepository;
    }
    async create(createSegmentDto) {
        const segment = this.segmentRepository.create(createSegmentDto);
        return this.segmentRepository.save(segment);
    }
    async findAll() {
        return this.segmentRepository.find();
    }
    async findOne(id) {
        const segment = await this.segmentRepository.findOne({ where: { id } });
        if (!segment) {
            throw new common_1.NotFoundException(`Segment with ID "${id}" not found`);
        }
        return segment;
    }
    async update(id, updateSegmentDto) {
        const segment = await this.findOne(id);
        Object.assign(segment, updateSegmentDto);
        return this.segmentRepository.save(segment);
    }
    async remove(id) {
        const result = await this.segmentRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Segment with ID "${id}" not found`);
        }
    }
};
exports.SegmentsService = SegmentsService;
exports.SegmentsService = SegmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(segments_entity_1.Segment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SegmentsService);
//# sourceMappingURL=segments.service.js.map