"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const customers_module_1 = require("./modules/customers/customers.module");
const singers_module_1 = require("./modules/singers/singers.module");
const requests_module_1 = require("./modules/requests/requests.module");
const matches_module_1 = require("./modules/matches/matches.module");
const schedules_module_1 = require("./modules/schedules/schedules.module");
const contracts_module_1 = require("./modules/contracts/contracts.module");
const negotiations_module_1 = require("./modules/negotiations/negotiations.module");
const payments_module_1 = require("./modules/payments/payments.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const files_module_1 = require("./modules/files/files.module");
const segments_module_1 = require("./modules/segments/segments.module");
const interactions_module_1 = require("./modules/interactions/interactions.module");
const feedbacks_module_1 = require("./modules/feedbacks/feedbacks.module");
const resources_module_1 = require("./modules/resources/resources.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: process.env.DB_HOST || "localhost",
                port: parseInt(process.env.DB_PORT || "5432", 10),
                username: process.env.DB_USERNAME || "eunchanko",
                password: process.env.DB_PASSWORD || "",
                database: process.env.DB_DATABASE || "crm_db",
                entities: [__dirname + "/**/*.entity{.ts,.js}"],
                synchronize: true,
                autoLoadEntities: true,
                retryAttempts: 10,
                retryDelay: 3000,
                logging: ["error", "warn", "schema"],
            }),
            customers_module_1.CustomersModule,
            singers_module_1.SingersModule,
            requests_module_1.RequestsModule,
            matches_module_1.MatchesModule,
            schedules_module_1.SchedulesModule,
            contracts_module_1.ContractsModule,
            negotiations_module_1.NegotiationsModule,
            payments_module_1.PaymentsModule,
            reviews_module_1.ReviewsModule,
            files_module_1.FilesModule,
            segments_module_1.SegmentsModule,
            interactions_module_1.InteractionsModule,
            feedbacks_module_1.FeedbacksModule,
            resources_module_1.ResourcesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map