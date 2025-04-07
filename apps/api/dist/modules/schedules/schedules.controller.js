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
var SchedulesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesController = void 0;
const common_1 = require("@nestjs/common");
const schedules_service_1 = require("./schedules.service");
const create_schedule_dto_1 = require("./dto/create-schedule.dto");
const update_schedule_dto_1 = require("./dto/update-schedule.dto");
let SchedulesController = SchedulesController_1 = class SchedulesController {
    constructor(schedulesService) {
        this.schedulesService = schedulesService;
        this.logger = new common_1.Logger(SchedulesController_1.name);
    }
    async create(createScheduleDto) {
        this.logger.log(`Creating schedule: ${JSON.stringify(createScheduleDto)}`);
        return this.schedulesService.create(createScheduleDto);
    }
    async findAll(query) {
        this.logger.log(`Finding all schedules with query: ${JSON.stringify(query)}`);
        return this.schedulesService.findAll(query);
    }
    async findByDate(year, month, day) {
        this.logger.log(`Finding schedules by date: year=${year}, month=${month}, day=${day || "not specified"}`);
        return this.schedulesService.findByDate(year, month, day);
    }
    async findOne(id) {
        this.logger.log(`Finding schedule with id: ${id}`);
        return this.schedulesService.findOne(id);
    }
    async update(id, updateScheduleDto) {
        this.logger.log(`Updating schedule ${id}: ${JSON.stringify(updateScheduleDto)}`);
        return this.schedulesService.update(id, updateScheduleDto);
    }
    async remove(id) {
        this.logger.log(`Removing schedule with id: ${id}`);
        return this.schedulesService.remove(id);
    }
};
exports.SchedulesController = SchedulesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("/date"),
    __param(0, (0, common_1.Query)("year")),
    __param(1, (0, common_1.Query)("month")),
    __param(2, (0, common_1.Query)("day")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_schedule_dto_1.UpdateScheduleDto]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulesController.prototype, "remove", null);
exports.SchedulesController = SchedulesController = SchedulesController_1 = __decorate([
    (0, common_1.Controller)("schedules"),
    __metadata("design:paramtypes", [schedules_service_1.SchedulesService])
], SchedulesController);
//# sourceMappingURL=schedules.controller.js.map