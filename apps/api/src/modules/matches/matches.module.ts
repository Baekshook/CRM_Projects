import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "./entities/match.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [],
  providers: [],
  exports: [],
})
export class MatchesModule {}
