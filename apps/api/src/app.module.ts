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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot({
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
  ],
})
export class AppModule {}
