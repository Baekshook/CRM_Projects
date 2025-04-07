import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Customer } from "../../customers/entities/customer.entity";
import { Singer } from "../../singers/entities/singer.entity";
import { Request } from "../../requests/entities/request.entity";
import { Match } from "../../matches/entities/match.entity";
import { Contract } from "../../contracts/entities/contract.entity";

@Entity("schedules")
export class Schedule {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamp" })
  scheduledDate: Date;

  @Column({ length: 255 })
  location: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ nullable: true })
  matchId: string;

  @Column({ nullable: true })
  requestId: string;

  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column()
  customerCompany: string;

  @Column()
  singerId: string;

  @Column()
  singerName: string;

  @Column()
  singerAgency: string;

  @Column()
  eventTitle: string;

  @Column()
  eventDate: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  venue: string;

  @Column({
    type: "enum",
    enum: ["scheduled", "in_progress", "completed", "cancelled", "changed"],
    default: "scheduled",
  })
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "changed";

  @Column("text")
  details: string;

  // 관계 정의
  @ManyToOne(() => Request, (request) => request.schedules, { nullable: true })
  @JoinColumn({ name: "requestId" })
  request: Request;

  @ManyToOne(() => Match, (match) => match.schedules, { nullable: true })
  @JoinColumn({ name: "matchId" })
  match: Match;

  @ManyToOne(() => Customer, (customer) => customer.schedules)
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @ManyToOne(() => Singer, (singer) => singer.schedules)
  @JoinColumn({ name: "singerId" })
  singer: Singer;

  @OneToMany(() => Contract, (contract) => contract.schedule)
  contracts: Contract[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
