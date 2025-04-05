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
var SegmentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentsController = void 0;
const common_1 = require("@nestjs/common");
const segments_service_1 = require("./segments.service");
const create_segment_dto_1 = require("./dto/create-segment.dto");
const update_segment_dto_1 = require("./dto/update-segment.dto");
let SegmentsController = SegmentsController_1 = class SegmentsController {
    constructor(segmentsService) {
        this.segmentsService = segmentsService;
        this.logger = new common_1.Logger(SegmentsController_1.name);
    }
    async create(createSegmentDto) {
        this.logger.log(`Creating segment: ${JSON.stringify(createSegmentDto)}`);
        return this.segmentsService.create(createSegmentDto);
    }
    async findAll() {
        this.logger.log("Finding all segments");
        return this.segmentsService.findAll();
    }
    async findOne(id) {
        this.logger.log(`Finding segment with id: ${id}`);
        return this.segmentsService.findOne(id);
    }
    async update(id, updateSegmentDto) {
        this.logger.log(`Updating segment ${id}: ${JSON.stringify(updateSegmentDto)}`);
        return this.segmentsService.update(id, updateSegmentDto);
    }
    async remove(id) {
        this.logger.log(`Removing segment with id: ${id}`);
        return this.segmentsService.remove(id);
    }
};
exports.SegmentsController = SegmentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_segment_dto_1.CreateSegmentDto]),
    __metadata("design:returntype", Promise)
], SegmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SegmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SegmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_segment_dto_1.UpdateSegmentDto]),
    __metadata("design:returntype", Promise)
], SegmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SegmentsController.prototype, "remove", null);
exports.SegmentsController = SegmentsController = SegmentsController_1 = __decorate([
    (0, common_1.Controller)("segments"),
    __metadata("design:paramtypes", [segments_service_1.SegmentsService])
], SegmentsController);
//# sourceMappingURL=segments.controller.js.map