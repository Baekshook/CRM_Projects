import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CustomersModule } from "./modules/customers/customers.module";
import { SingersModule } from "./modules/singers/singers.module";
import { RequestsModule } from "./modules/requests/requests.module";
import { MatchesModule } from "./modules/matches/matches.module";
import { SchedulesModule } from "./modules/schedules/schedules.module";
import { ContractsModule } from "./modules/contracts/contracts.module";
import { NegotiationsModule } from "./modules/negotiations/negotiations.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { FilesModule } from "./modules/files/files.module";
import { SegmentsModule } from "./modules/segments/segments.module";
import { InteractionsModule } from "./modules/interactions/interactions.module";
import { FeedbacksModule } from "./modules/feedbacks/feedbacks.module";
import { ResourcesModule } from "./modules/resources/resources.module";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot({
      type: "postgres", // 'mysql'에서 'postgres'로 변경
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432, // PostgreSQL 기본 포트는 5432
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || "postgres", // 기본값으로 'postgres' 사용
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true, // 개발 환경에서만 true로 설정
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      extra: {
        trustServerCertificate: true,
      },
      autoLoadEntities: true, // 자동으로 엔티티 로드
    }),

    CustomersModule,
    SingersModule,
    RequestsModule,
    MatchesModule,
    SchedulesModule,
    ContractsModule,
    NegotiationsModule,
    PaymentsModule,
    ReviewsModule,
    FilesModule,
    SegmentsModule,
    InteractionsModule,
    FeedbacksModule,
    ResourcesModule,
  ],
})
export class AppModule {}
