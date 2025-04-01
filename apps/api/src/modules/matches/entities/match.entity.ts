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
import { Schedule } from "../../schedules/entities/schedule.entity";
import { Contract } from "../../contracts/entities/contract.entity";
import { NegotiationLog } from "../../negotiations/entities/negotiation-log.entity";

@Entity("matches")
export class Match {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  requestId: string;

  @Column()
  requestTitle: string;

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
  eventDate: string;

  @Column()
  venue: string;

  @Column({
    type: "enum",
    enum: ["pending", "negotiating", "confirmed", "cancelled"],
    default: "pending",
  })
  status: "pending" | "negotiating" | "confirmed" | "cancelled";

  @Column()
  budget: string;

  @Column("text")
  requirements: string;

  @Column("text", { nullable: true })
  notes: string;

  @Column({ type: "int", default: 0 })
  price: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // 관계 정의
  @ManyToOne(() => Request, (request) => request.matches)
  @JoinColumn({ name: "requestId" })
  request: Request;

  @ManyToOne(() => Customer, (customer) => customer.matches)
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @ManyToOne(() => Singer, (singer) => singer.matches)
  @JoinColumn({ name: "singerId" })
  singer: Singer;

  @OneToMany(() => Schedule, (schedule) => schedule.match)
  schedules: Schedule[];

  @OneToMany(() => Contract, (contract) => contract.match)
  contracts: Contract[];

  @OneToMany(() => NegotiationLog, (negotiationLog) => negotiationLog.match)
  negotiationLogs: NegotiationLog[];
}
