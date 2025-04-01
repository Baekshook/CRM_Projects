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
import { Match } from "../../matches/entities/match.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";
import { Contract } from "../../contracts/entities/contract.entity";

@Entity("requests")
export class Request {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column()
  customerCompany: string;

  @Column()
  eventType: string;

  @Column()
  eventDate: string;

  @Column()
  venue: string;

  @Column()
  budget: string;

  @Column("text")
  requirements: string;

  @Column({
    type: "enum",
    enum: ["pending", "in_progress", "completed", "cancelled"],
    default: "pending",
  })
  status: "pending" | "in_progress" | "completed" | "cancelled";

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column()
  eventTime: string;

  @Column({ nullable: true })
  singerId: string;

  @Column({ nullable: true })
  singerName: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // 관계 정의
  @ManyToOne(() => Customer, (customer) => customer.requests)
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @ManyToOne(() => Singer, (singer) => singer.requests, { nullable: true })
  @JoinColumn({ name: "singerId" })
  singer: Singer;

  @OneToMany(() => Match, (match) => match.request)
  matches: Match[];

  @OneToMany(() => Schedule, (schedule) => schedule.request)
  schedules: Schedule[];

  @OneToMany(() => Contract, (contract) => contract.request)
  contracts: Contract[];
}
