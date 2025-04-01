import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Match } from "../../matches/entities/match.entity";

@Entity("negotiation_logs")
export class NegotiationLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  matchId: string;

  @Column()
  date: string;

  @Column()
  type: string;

  @Column("text")
  content: string;

  @Column()
  user: string;

  // 관계 정의
  @ManyToOne(() => Match, (match) => match.negotiationLogs)
  @JoinColumn({ name: "matchId" })
  match: Match;
}
