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
var SchedulesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_entity_1 = require("./entities/schedule.entity");
let SchedulesService = SchedulesService_1 = class SchedulesService {
    constructor(schedulesRepository) {
        this.schedulesRepository = schedulesRepository;
        this.logger = new common_1.Logger(SchedulesService_1.name);
    }
    async create(createScheduleDto) {
        try {
            this.logger.log(`Creating schedule: ${JSON.stringify(createScheduleDto)}`);
            if (!createScheduleDto.matchId ||
                createScheduleDto.matchId === "00000000-0000-0000-0000-000000000000") {
                createScheduleDto.matchId = null;
            }
            if (!createScheduleDto.requestId ||
                createScheduleDto.requestId === "00000000-0000-0000-0000-000000000000") {
                createScheduleDto.requestId = null;
            }
            let scheduledDate;
            try {
                scheduledDate = new Date(createScheduleDto.scheduledDate);
                if (isNaN(scheduledDate.getTime())) {
                    throw new common_1.BadRequestException("Invalid date format for scheduledDate");
                }
            }
            catch (error) {
                throw new common_1.BadRequestException("Invalid date format for scheduledDate: " + error.message);
            }
            const scheduleData = {
                ...createScheduleDto,
                scheduledDate,
            };
            const requiredFields = [
                "customerId",
                "customerName",
                "singerId",
                "singerName",
                "eventTitle",
                "eventDate",
                "venue",
                "location",
                "details",
            ];
            for (const field of requiredFields) {
                if (!scheduleData[field]) {
                    throw new common_1.BadRequestException(`Missing required field: ${field}`);
                }
            }
            const stringFields = [
                "customerCompany",
                "singerAgency",
                "description",
                "startTime",
                "endTime",
            ];
            for (const field of stringFields) {
                if (scheduleData[field] === undefined || scheduleData[field] === null) {
                    scheduleData[field] = "";
                }
            }
            this.logger.log(`Creating schedule with processed data: ${JSON.stringify(scheduleData)}`);
            const schedule = this.schedulesRepository.create(scheduleData);
            return await this.schedulesRepository.save(schedule);
        }
        catch (error) {
            this.logger.error(`Error creating schedule: ${error.message}`, error.stack);
            if (error.code === "23505") {
                throw new common_1.BadRequestException("A schedule with these details already exists");
            }
            else if (error.code === "23503") {
                let errorMessage = "Foreign key constraint violation.";
                if (error.detail) {
                    if (error.detail.includes("customerId")) {
                        errorMessage =
                            "The specified customer does not exist in the database.";
                    }
                    else if (error.detail.includes("singerId")) {
                        errorMessage =
                            "The specified singer does not exist in the database.";
                    }
                    else if (error.detail.includes("matchId")) {
                        errorMessage =
                            "The specified match does not exist in the database.";
                    }
                    else if (error.detail.includes("requestId")) {
                        errorMessage =
                            "The specified request does not exist in the database.";
                    }
                }
                throw new common_1.BadRequestException(errorMessage);
            }
            else if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException(`Failed to create schedule: ${error.message}`);
            }
        }
    }
    async findAll(query) {
        try {
            const options = {
                relations: ["customer", "singer"],
            };
            if (query && query.status && query.status !== "all") {
                options.where = { ...options.where, status: query.status };
            }
            return await this.schedulesRepository.find(options);
        }
        catch (error) {
            this.logger.error(`Error finding schedules: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to retrieve schedules: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            const schedule = await this.schedulesRepository.findOne({
                where: { id },
                relations: ["customer", "singer"],
            });
            if (!schedule) {
                throw new common_1.NotFoundException(`Schedule with ID "${id}" not found`);
            }
            return schedule;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error finding schedule by id ${id}: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to retrieve schedule: ${error.message}`);
        }
    }
    async update(id, updateScheduleDto) {
        try {
            const schedule = await this.findOne(id);
            if (updateScheduleDto.scheduledDate) {
                try {
                    const scheduledDate = new Date(updateScheduleDto.scheduledDate);
                    if (isNaN(scheduledDate.getTime())) {
                        throw new common_1.BadRequestException("Invalid date format for scheduledDate");
                    }
                    updateScheduleDto.scheduledDate = scheduledDate.toISOString();
                }
                catch (error) {
                    throw new common_1.BadRequestException("Invalid date format for scheduledDate: " + error.message);
                }
            }
            Object.assign(schedule, updateScheduleDto);
            return await this.schedulesRepository.save(schedule);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Error updating schedule ${id}: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to update schedule: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const result = await this.schedulesRepository.delete(id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Schedule with ID "${id}" not found`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error removing schedule ${id}: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to remove schedule: ${error.message}`);
        }
    }
    async findByDate(year, month, day) {
        try {
            const startDate = new Date(year, month - 1, day || 1);
            let endDate;
            if (day) {
                endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
            }
            else {
                endDate = new Date(year, month, 0, 23, 59, 59, 999);
            }
            const schedules = await this.schedulesRepository.find({
                where: {
                    scheduledDate: (0, typeorm_2.Between)(startDate, endDate),
                },
                relations: ["customer", "singer"],
            });
            return schedules;
        }
        catch (error) {
            this.logger.error(`Error finding schedules by date: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to retrieve schedules by date: ${error.message}`);
        }
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = SchedulesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(schedule_entity_1.Schedule)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map