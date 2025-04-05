import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Match } from "../../matches/entities/match.entity";
import { Negotiation } from "./negotiation.entity";

@Entity("negotiation_logs")
export class NegotiationLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  matchId: string;

  @Column()
  negotiationId: string;

  @Column()
  date: string;

  @Column()
  type: string;

  @Column("text")
  content: string;

  @Column()
  user: string;

  @CreateDateColumn()
  createdAt: Date;

  // 관계 정의
  @ManyToOne(() => Match, (match) => match.negotiationLogs, { nullable: true })
  @JoinColumn({ name: "matchId" })
  match: Match;

  @ManyToOne(() => Negotiation, (negotiation) => negotiation.logs)
  @JoinColumn({ name: "negotiationId" })
  negotiation: Negotiation;
}
