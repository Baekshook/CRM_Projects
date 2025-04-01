import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Customer } from "../../customers/entities/customer.entity";
import { Singer } from "../../singers/entities/singer.entity";
import { Request } from "../../requests/entities/request.entity";
import { Match } from "../../matches/entities/match.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";
import { Payment } from "../../payments/entities/payment.entity";
import { Review } from "../../reviews/entities/review.entity";

@Entity("contracts")
export class Contract {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  matchId: string;

  @Column()
  scheduleId: string;

  @Column()
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
  venue: string;

  @Column()
  contractAmount: string;

  @Column({
    type: "enum",
    enum: ["unpaid", "partial", "paid"],
    default: "unpaid",
  })
  paymentStatus: "unpaid" | "partial" | "paid";

  @Column({
    type: "enum",
    enum: ["draft", "sent", "signed", "completed", "cancelled"],
    default: "draft",
  })
  contractStatus: "draft" | "sent" | "signed" | "completed" | "cancelled";

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Column({ nullable: true })
  signedAt: string;

  // 관계 정의
  @ManyToOne(() => Customer, (customer) => customer.contracts)
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @ManyToOne(() => Singer, (singer) => singer.contracts)
  @JoinColumn({ name: "singerId" })
  singer: Singer;

  @ManyToOne(() => Request, (request) => request.contracts)
  @JoinColumn({ name: "requestId" })
  request: Request;

  @ManyToOne(() => Match, (match) => match.contracts)
  @JoinColumn({ name: "matchId" })
  match: Match;

  @ManyToOne(() => Schedule, (schedule) => schedule.contracts)
  @JoinColumn({ name: "scheduleId" })
  schedule: Schedule;

  @OneToMany(() => Payment, (payment) => payment.contract)
  payments: Payment[];

  @OneToMany(() => Review, (review) => review.contract)
  reviews: Review[];
}
